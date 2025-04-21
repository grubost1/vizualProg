using CommentApi.Models;

namespace CommentApi.Repositories
{
    public interface ICommentRepository
    {
        IEnumerable<Comment> GetAll();
        Comment? GetById(int id);
        void Add(Comment comment);
        void Update(int id, Comment updatedComment);
        void Delete(int id);
    }
}