using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SAAMSONSDISTRIBUTORS.Models;
using SAAMSONSDISTRIBUTORS.Dtos;
using SAAMSONSDISTRIBUTORS.DTOs;

namespace SAAMSONSDISTRIBUTORS.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CartController : ControllerBase
    {
        private readonly AppDbContext _context;
        public CartController(AppDbContext context) => _context = context;

        // GET: api/cart?userId=abc
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cart>>> GetCart([FromQuery] string userId)
        {
            if (string.IsNullOrWhiteSpace(userId))
                return BadRequest("userId is required.");

            var items = await _context.Carts
                .Where(c => c.UserId == userId)
                .Include(c => c.Product)
                .OrderBy(c => c.Id)
                .ToListAsync();

            return Ok(items);
        }

        // POST: api/cart
        [HttpPost]
        public async Task<ActionResult<Cart>> AddToCart([FromBody] AddToCartRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.UserId))
                return BadRequest("userId is required.");
            if (request.Quantity <= 0)
                return BadRequest("Quantity must be greater than zero.");

            var product = await _context.Products.FindAsync(request.ProductId);
            if (product == null) return NotFound("Product not found.");

            // upsert by (UserId, ProductId)
            var existing = await _context.Carts
                .FirstOrDefaultAsync(c => c.UserId == request.UserId && c.ProductId == request.ProductId);

            if (existing is not null)
            {
                existing.Quantity += request.Quantity;
                await _context.SaveChangesAsync();
                await _context.Entry(existing).Reference(c => c.Product).LoadAsync();
                return Ok(existing);
            }

            var cart = new Cart
            {
                UserId = request.UserId,
                ProductId = request.ProductId,
                Quantity = request.Quantity
            };

            _context.Carts.Add(cart);
            await _context.SaveChangesAsync();
            await _context.Entry(cart).Reference(c => c.Product).LoadAsync();

            return CreatedAtAction(nameof(GetById), new { id = cart.Id }, cart);
        }

        [HttpPost("checkout")]
        public async Task<ActionResult> Checkout([FromBody] CheckoutRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.UserId))
                return BadRequest("userId is required.");
            if (request.ClientId <= 0)
                return BadRequest("clientId is required.");
            if (string.IsNullOrWhiteSpace(request.InvoiceNumber))
                request.InvoiceNumber = $"INV-{DateTime.UtcNow:yyyyMMddHHmmss}";

            var cartLines = await _context.Carts
                .Include(c => c.Product)                 // <-- ensure Product is loaded & tracked
                .Where(c => c.UserId == request.UserId && c.ClientId == request.ClientId)
                .OrderBy(c => c.Id)
                .ToListAsync();

            if (cartLines.Count == 0)
                return BadRequest("Cart is empty.");

            // 1) Validate stock against Product.Quantity (NOT cart quantity)
            var insufficient = new List<string>();
            foreach (var c in cartLines)
            {
                var available = c.Product?.Quantity ?? 0;
                if (c.Quantity > available)
                {
                    insufficient.Add($"{c.Product?.Name ?? $"ProductId {c.ProductId}"}: requested {c.Quantity}, available {available}");
                }
            }
            if (insufficient.Count > 0)
            {
                return BadRequest(new { message = "Insufficient stock.", details = insufficient });
            }

            using var tx = await _context.Database.BeginTransactionAsync();
            try
            {
                foreach (var c in cartLines)
                {
                    if (c.Product is null)
                        return BadRequest($"Product {c.ProductId} not found.");

                    // 2) Decrement **Product.Quantity** (this is the fix)
                    var currentStock = c.Product.Quantity ?? 0;
                    c.Product.Quantity = Math.Max(0, currentStock - c.Quantity); // guard against negative

                    // 3) Create Delivery line (snapshot values from cart)
                    _context.Deliveries.Add(new Delivery
                    {
                        ProductId = c.ProductId,
                        ClientId = c.ClientId,
                        UserId = c.UserId,
                        InvoiceNumber = request.InvoiceNumber,
                        Status = CartStatus.In_Progress,
                        Quantity = c.Quantity,
                        UnitPriceAtTime = c.UnitPriceAtTime,
                        DiscountPerProduct = c.DiscountPerProduct,
                        PercentageDiscount = c.PercentageDiscount,
                        TotalDiscount = c.TotalDiscount,
                        Total = c.TotalPrice,
                        CreatedDate = DateTime.UtcNow
                    });

                    // 4) DO NOT modify c.Quantity here — we only remove the cart line after
                }

                // 5) Clear cart lines after moving to delivery
                _context.Carts.RemoveRange(cartLines);

                await _context.SaveChangesAsync();
                await tx.CommitAsync();

                return Ok(new
                {
                    message = "Checkout successful. Items moved to delivery and product stock updated.",
                    invoiceNumber = request.InvoiceNumber
                });
            }
            catch
            {
                await tx.RollbackAsync();
                throw;
            }
        }



        // GET: api/cart/5
        [HttpGet("{id:int}")]
        public async Task<ActionResult<Cart>> GetById(int id)
        {
            var item = await _context.Carts
                .Include(c => c.Product)
                .FirstOrDefaultAsync(c => c.Id == id);

            return item is null ? NotFound() : item;
        }

        // PUT: api/cart/5?userId=abc  (update quantity)
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateQuantity(int id, [FromQuery] string userId, [FromBody] UpdateCartQuantityRequest request)
        {
            if (string.IsNullOrWhiteSpace(userId))
                return BadRequest("userId is required.");
            if (request.Quantity < 0)
                return BadRequest("Quantity cannot be negative.");

            var item = await _context.Carts.FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);
            if (item is null) return NotFound();

            if (request.Quantity == 0)
                _context.Carts.Remove(item);
            else
                item.Quantity = request.Quantity;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/cart/5?userId=abc
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Remove(int id, [FromQuery] string userId)
        {
            if (string.IsNullOrWhiteSpace(userId))
                return BadRequest("userId is required.");

            var item = await _context.Carts.FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);
            if (item is null) return NotFound();

            _context.Carts.Remove(item);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/cart?userId=abc  (clear cart)
        [HttpDelete]
        public async Task<IActionResult> Clear([FromQuery] string userId)
        {
            if (string.IsNullOrWhiteSpace(userId))
                return BadRequest("userId is required.");

            var items = await _context.Carts.Where(c => c.UserId == userId).ToListAsync();
            if (items.Count == 0) return NoContent();

            _context.Carts.RemoveRange(items);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
