using Homework_11.Models;
using Microsoft.EntityFrameworkCore;

namespace Homework_11.Data
{
    public class ApplicationDbContext : DbContext
    {
        public DbSet<Comment> Comments { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            modelBuilder.Entity<Comment>().HasData(
                new Comment { Id = 1, Text = "Initial comment", Author = "Admin", Email = "admin@example.com" }
            );
        }
    }
}