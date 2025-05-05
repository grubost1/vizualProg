using Microsoft.Extensions.Logging;
using Homework_12.Data;
using Homework_12.Models;
using Npgsql; // Add Npgsql for exception type checking
using Microsoft.EntityFrameworkCore; // Add EF Core for exception type checking

namespace Homework_12.Logging
{
    public class DatabaseLogger : ILogger
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly string _categoryName;

        public DatabaseLogger(IServiceScopeFactory scopeFactory, string categoryName)
        {
            _scopeFactory = scopeFactory;
            _categoryName = categoryName;
        }

        public IDisposable? BeginScope<TState>(TState state) where TState : notnull => null;

        public bool IsEnabled(LogLevel logLevel) => true;

        public void Log<TState>(
            LogLevel logLevel,
            EventId eventId,
            TState state,
            Exception? exception,
            Func<TState, Exception?, string> formatter)
        {
            // Prevent logging loop if the error is from EF Core itself or Npgsql
            if (_categoryName.StartsWith("Microsoft.EntityFrameworkCore") || exception is NpgsqlException || exception is DbUpdateException)
            {
                 // Log database-related errors only to console
                Console.WriteLine($"[DB Logger Skipped] {_categoryName} - {logLevel}: {formatter(state, exception)}");
                if (exception != null)
                {
                    Console.WriteLine(exception.ToString());
                }
                return;
            }

            try
            {
                var message = formatter(state, exception);

                using var scope = _scopeFactory.CreateScope();
                var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

                var log = new Log
                {
                    Message = message,
                    Level = logLevel.ToString(),
                    Timestamp = DateTime.UtcNow
                };

                context.Logs.Add(log);
                context.SaveChanges();
            }
            catch (Exception ex)
            {
                // Log error during logging attempt only to console
                Console.WriteLine($"Error while logging to database: {ex.Message}");
                // Also log the original message that failed to log
                Console.WriteLine($"Original log message: {_categoryName} - {logLevel}: {formatter(state, exception)}");

            }
        }
    }
}