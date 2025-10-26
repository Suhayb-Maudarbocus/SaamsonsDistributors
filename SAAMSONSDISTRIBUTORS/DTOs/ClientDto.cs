namespace SAAMSONSDISTRIBUTORS.Dtos
{
    public class CreateClientRequest
    {
        public string Name { get; set; } = string.Empty;
        public string? BRN { get; set; }
        public string? VATRegistrationNumber { get; set; }
        public string? Address { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Email { get; set; }
        public string? ContactPerson { get; set; }
        public bool IsActive { get; set; } = true;
    }

    public class UpdateClientRequest : CreateClientRequest
    {
        public bool? IsActiveOverride { get; set; } // optional if you want explicit toggle
    }
}
