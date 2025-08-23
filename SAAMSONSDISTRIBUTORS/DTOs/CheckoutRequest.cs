namespace SAAMSONSDISTRIBUTORS.DTOs
{
    public class CheckoutRequest
    {
        public string UserId { get; set; } = string.Empty;
        public int ClientId { get; set; }
        public string InvoiceNumber { get; set; } = string.Empty; // you can generate if empty
    }

}
