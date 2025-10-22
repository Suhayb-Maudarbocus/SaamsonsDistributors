// Cart.cs
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SAAMSONSDISTRIBUTORS.Models
{
    public class Cart
    {
        [Key] 
        public int Id { get; set; }

        [Required] 
        public int ProductId { get; set; }
        public Product? Product { get; set; }

        [Required, MaxLength(128)]
        public string UserId { get; set; } = string.Empty;

        [Required] 
        public int ClientId { get; set; } // assume Client exists

        [Required]
        public CartStatus Status { get; set; } = CartStatus.In_Progress;

        [Required] 
        public int Quantity { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal UnitPriceAtTime { get; set; }  // snapshot

        [Column(TypeName = "decimal(18,2)")]
        public decimal SellingPriceAtTime { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal DiscountPerProduct { get; set; } = 0m;

        [Column(TypeName = "decimal(5,2)")]
        public decimal PercentageDiscount { get; set; } = 0m;

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalDiscount { get; set; } = 0m;

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalPrice
        {
            get
            {
                return Product?.SellingPrice.HasValue == true ?
                    Product.SellingPrice.Value * Quantity : 0;
            }
        }

        [MaxLength(50)]
        public string? InvoiceNumber { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    }
}
