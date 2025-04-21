using CommentApi.Models;

namespace CommentApi.Repositories
{
    public class CommentRepository : ICommentRepository
    {
        private readonly Dictionary<int, Comment> _comments = new();
        private int _currentId = 1;

        public IEnumerable<Comment> GetAll()
        {
            return _comments.Values;
        }

        public Comment? GetById(int id)
        {
            return _comments.ContainsKey(id) ? _comments[id] : null;
        }

        public void Add(Comment comment)
        {
            comment.Id = _currentId++;
            _comments[comment.Id] = comment;
        }

        public void Update(int id, Comment updatedComment)
        {
            if (_comments.ContainsKey(id))
            {
                updatedComment.Id = id; // Ensure the ID remains consistent
                _comments[id] = updatedComment;
            }
        }

        public void Delete(int id)
        {
            _comments.Remove(id);
        }
    }
}