using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SAAMSONSDISTRIBUTORS.Dtos;
using SAAMSONSDISTRIBUTORS.Models;

namespace SAAMSONSDISTRIBUTORS.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClientsController : ControllerBase
    {
        private readonly AppDbContext _context;
        public ClientsController(AppDbContext context) => _context = context;

        // GET: api/clients?search=&skip=0&take=50&activeOnly=true
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Client>>> GetAll(
            [FromQuery] string? search = null,
            [FromQuery] int skip = 0,
            [FromQuery] int take = 50,
            [FromQuery] bool activeOnly = false)
        {
            var query = _context.Clients.AsNoTracking().AsQueryable();

            if (activeOnly)
                query = query.Where(c => c.IsActive);

            if (!string.IsNullOrWhiteSpace(search))
            {
                var s = search.Trim().ToLower();
                query = query.Where(c =>
                    c.Name.ToLower().Contains(s) ||
                    (c.BRN != null && c.BRN.ToLower().Contains(s)) ||
                    (c.VATRegistrationNumber != null && c.VATRegistrationNumber.ToLower().Contains(s)) ||
                    (c.Email != null && c.Email.ToLower().Contains(s)) ||
                    (c.PhoneNumber != null && c.PhoneNumber.ToLower().Contains(s)));
            }

            var total = await query.CountAsync();
            var items = await query
                .OrderBy(c => c.Name)
                .Skip(skip)
                .Take(take)
                .ToListAsync();

            // Return paging info in headers (optional)
            Response.Headers["X-Total-Count"] = total.ToString();

            return Ok(items);
        }

        // GET: api/clients/5
        [HttpGet("{id:int}")]
        public async Task<ActionResult<Client>> GetById(int id)
        {
            var client = await _context.Clients.AsNoTracking().FirstOrDefaultAsync(c => c.Id == id);
            return client is null ? NotFound() : client;
        }

        // POST: api/clients
        [HttpPost]
        public async Task<ActionResult<Client>> Create([FromBody] CreateClientRequest req)
        {
            if (string.IsNullOrWhiteSpace(req.Name))
                return BadRequest("Name is required.");

            // Optional uniqueness checks
            if (!string.IsNullOrWhiteSpace(req.BRN))
            {
                var existsBrn = await _context.Clients.AnyAsync(c => c.BRN == req.BRN);
                if (existsBrn) return Conflict("A client with the same BRN already exists.");
            }
            if (!string.IsNullOrWhiteSpace(req.VATRegistrationNumber))
            {
                var existsVat = await _context.Clients.AnyAsync(c => c.VATRegistrationNumber == req.VATRegistrationNumber);
                if (existsVat) return Conflict("A client with the same VAT Registration Number already exists.");
            }

            var client = new Client
            {
                Name = req.Name.Trim(),
                BRN = req.BRN?.Trim(),
                VATRegistrationNumber = req.VATRegistrationNumber?.Trim(),
                Address = req.Address?.Trim(),
                PhoneNumber = req.PhoneNumber?.Trim(),
                Email = req.Email?.Trim(),
                ContactPerson = req.ContactPerson?.Trim(),
                IsActive = req.IsActive,
                CreatedDate = DateTime.UtcNow,
                // CreatedBy = user id if you have auth
            };

            _context.Clients.Add(client);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = client.Id }, client);
        }

        // PUT: api/clients/5
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateClientRequest req)
        {
            var client = await _context.Clients.FirstOrDefaultAsync(c => c.Id == id);
            if (client is null) return NotFound();

            if (!string.IsNullOrWhiteSpace(req.BRN) && req.BRN != client.BRN)
            {
                var existsBrn = await _context.Clients.AnyAsync(c => c.BRN == req.BRN && c.Id != id);
                if (existsBrn) return Conflict("Another client with the same BRN already exists.");
            }
            if (!string.IsNullOrWhiteSpace(req.VATRegistrationNumber) && req.VATRegistrationNumber != client.VATRegistrationNumber)
            {
                var existsVat = await _context.Clients.AnyAsync(c => c.VATRegistrationNumber == req.VATRegistrationNumber && c.Id != id);
                if (existsVat) return Conflict("Another client with the same VAT Registration Number already exists.");
            }

            if (!string.IsNullOrWhiteSpace(req.Name)) client.Name = req.Name.Trim();
            client.BRN = req.BRN?.Trim();
            client.VATRegistrationNumber = req.VATRegistrationNumber?.Trim();
            client.Address = req.Address?.Trim();
            client.PhoneNumber = req.PhoneNumber?.Trim();
            client.Email = req.Email?.Trim();
            client.ContactPerson = req.ContactPerson?.Trim();

            if (req.IsActiveOverride.HasValue)
                client.IsActive = req.IsActiveOverride.Value;
            else
                client.IsActive = req.IsActive; // keep same behavior if you pass it

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/clients/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var client = await _context.Clients.FirstOrDefaultAsync(c => c.Id == id);
            if (client is null) return NotFound();

            _context.Clients.Remove(client);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
