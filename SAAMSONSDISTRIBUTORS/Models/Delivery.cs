// Delivery.cs
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SAAMSONSDISTRIBUTORS.Models
{
    public class Delivery
    {
        [Key] 
        public int Id { get; set; }

        [Required] 
        public int ProductId { get; set; }
        public Product? Product { get; set; }

        [Required] 
        public int ClientId { get; set; }

        [Required, MaxLength(128)]
        public string UserId { get; set; } = string.Empty;

        [MaxLength(50)]
        public string InvoiceNumber { get; set; } = string.Empty;

        [Required]
        public CartStatus Status { get; set; } = CartStatus.Pending; // Pending, Delivery, In Progress

        [Required] public int Quantity { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal UnitPriceAtTime { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal DiscountPerProduct { get; set; } = 0m;

        [Column(TypeName = "decimal(5,2)")]
        public decimal PercentageDiscount { get; set; } = 0m;

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalDiscount { get; set; } = 0m;

        [Column(TypeName = "decimal(18,2)")]
        public decimal Total { get; set; } = 0m;

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    }
}
