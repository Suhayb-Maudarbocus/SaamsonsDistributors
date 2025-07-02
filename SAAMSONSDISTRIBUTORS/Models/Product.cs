using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SAAMSONSDISTRIBUTORS.Models
{
    public class Product
    {
        [Key]
        public int Id { get; set; }

        [Column(TypeName = "nvarchar(8)")]
        public string? Code { get; set; }

        [Column(TypeName = "nvarchar(100)")]
        public string? Name { get; set; }

        [Column(TypeName = "nvarchar(255)")]
        public string? Url { get; set; }

        public float? UnitPrice { get; set; }

        public float? SellingPrice { get; set; }

        [Column(TypeName = "nvarchar(100)")]
        public string? SupplierName { get; set; }

        [Column(TypeName = "int")]
        public int? Quantity { get; set; }
    }
}
