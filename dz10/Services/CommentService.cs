using CommentApi.Models;
using CommentApi.Repositories;

namespace CommentApi.Services
{
    public class CommentService
    {
        private readonly ICommentRepository _repository;

        public CommentService(ICommentRepository repository)
        {
            _repository = repository;
        }

        public IEnumerable<Comment> GetAllComments()
        {
            return _repository.GetAll();
        }

        public Comment? GetCommentById(int id)
        {
            return _repository.GetById(id);
        }

        public void AddComment(Comment comment)
        {
            _repository.Add(comment);
        }

        public void UpdateComment(int id, Comment updatedComment)
        {
            _repository.Update(id, updatedComment);
        }

        public void DeleteComment(int id)
        {
            _repository.Delete(id);
        }
    }
}