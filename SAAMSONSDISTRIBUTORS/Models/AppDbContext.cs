using Microsoft.EntityFrameworkCore;

namespace SAAMSONSDISTRIBUTORS.Models
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Product> Products { get; set; }
        public DbSet<Cart> Carts { get; set; }
        public DbSet<Delivery> Deliveries { get; set; }
        public DbSet<Sale> Sales { get; set; }

    }
}
