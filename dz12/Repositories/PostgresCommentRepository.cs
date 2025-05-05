using Homework_12.Data;
using Homework_12.Models;
using Homework_12.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Homework_12.Repositories
{
    public class PostgresCommentRepository : ICommentRepository
    {
        private readonly ApplicationDbContext _context;

        public PostgresCommentRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public IEnumerable<Comment> GetAll()
        {
            return _context.Comments.ToList();
        }

        public Comment? GetById(int id)
        {
            return _context.Comments.FirstOrDefault(c => c.Id == id);
        }

        public void Add(Comment comment)
        {
            _context.Comments.Add(comment);
            _context.SaveChanges();
        }

        public void Update(int id, Comment updatedComment)
        {
            var existingComment = _context.Comments.FirstOrDefault(c => c.Id == id);
            if (existingComment != null)
            {
                existingComment.Text = updatedComment.Text;
                existingComment.Author = updatedComment.Author;
                existingComment.Email = updatedComment.Email;
                _context.SaveChanges();
            }
        }

        public void Delete(int id)
        {
            var comment = _context.Comments.FirstOrDefault(c => c.Id == id);
            if (comment != null)
            {
                _context.Comments.Remove(comment);
                _context.SaveChanges();
            }
        }
    }
}