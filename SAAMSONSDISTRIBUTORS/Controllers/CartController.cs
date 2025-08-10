using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SAAMSONSDISTRIBUTORS.Models;
using SAAMSONSDISTRIBUTORS.Dtos;

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
