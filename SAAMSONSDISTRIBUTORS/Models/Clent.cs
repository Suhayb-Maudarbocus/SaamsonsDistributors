using System.ComponentModel.DataAnnotations;

namespace SAAMSONSDISTRIBUTORS.Models
{
    public class Client
    {
        [Key]
        public int Id { get; set; }

        [Required, MaxLength(150)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(50)]
        public string? BRN { get; set; } // Business Registration Number

        [MaxLength(50)]
        public string? VATRegistrationNumber { get; set; }

        [MaxLength(255)]
        public string? Address { get; set; }

        [MaxLength(50)]
        public string? PhoneNumber { get; set; }

        [MaxLength(100)]
        [EmailAddress]
        public string? Email { get; set; }

        [MaxLength(255)]
        public string? ContactPerson { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        // Optional: if you want to link which user created this client
        public string? CreatedBy { get; set; }

        // Optional: active/inactive flag
        public bool IsActive { get; set; } = true;
    }
}

