namespace CommentApi.Models
{
    public class Comment
    {
        public int Id { get; set; }
        public string Text { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }
}