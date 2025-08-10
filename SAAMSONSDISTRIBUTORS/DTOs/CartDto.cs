namespace SAAMSONSDISTRIBUTORS.Dtos
{
    public class AddToCartRequest
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; } = 1;
        public string UserId { get; set; } = string.Empty; // required
    }

    public class UpdateCartQuantityRequest
    {
        public int Quantity { get; set; }
    }
}
