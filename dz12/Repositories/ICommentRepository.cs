using Homework_12.Models;

namespace Homework_12.Repositories
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