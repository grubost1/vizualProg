using Homework_12.Data;
using Homework_12.Models;
using Homework_12.Repositories;
using Homework_12.Services;
using Homework_12.Logging;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

// Добавляем контекст базы данных
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Логгирование
builder.Services.AddSingleton<ILoggerProvider>(sp =>
{
    var scopeFactory = sp.GetRequiredService<IServiceScopeFactory>();
    return new DatabaseLoggerProvider(scopeFactory);
});

// Репозиторий и сервисы
builder.Services.AddScoped<ICommentRepository, PostgresCommentRepository>();
builder.Services.AddScoped<CommentService>();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

app.UseCors("AllowAll");

// Логи
app.MapGet("/logs", async ([FromServices] ApplicationDbContext context) =>
{
    try
    {
        var logs = await context.Logs.OrderByDescending(l => l.Timestamp).ToListAsync();
        return Results.Ok(logs);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error while fetching logs: {ex.Message}");
        return Results.Problem("An error occurred while fetching logs.");
    }
});

app.MapGet("/logs/search", async ([FromServices] ApplicationDbContext context, [FromQuery] string query) =>
{
    try
    {
        // Convert both message and query to lower case for case-insensitive search
        var lowerCaseQuery = query.ToLower(); 
        var logs = await context.Logs
            .Where(l => l.Message.ToLower().Contains(lowerCaseQuery)) 
            .OrderByDescending(l => l.Timestamp)
            .ToListAsync();
        return Results.Ok(logs);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error while searching logs: {ex.Message}");
        return Results.Problem("An error occurred while searching logs.");
    }
});

// Комментарии
app.MapGet("/comments", ([FromServices] CommentService service) =>
{
    try
    {
        var comments = service.GetAllComments();
        return Results.Ok(comments);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error while fetching comments: {ex.Message}");
        return Results.Problem("An error occurred while fetching comments.");
    }
});

app.MapGet("/comments/{id}", ([FromServices] CommentService service, int id) =>
{
    try
    {
        var comment = service.GetCommentById(id);
        return comment is not null ? Results.Ok(comment) : Results.NotFound();
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error while fetching comment by ID: {ex.Message}");
        return Results.Problem("An error occurred while fetching the comment.");
    }
});

app.MapPost("/comments", ([FromServices] CommentService service, [FromBody] Comment comment) =>
{
    try
    {
        service.AddComment(comment);
        return Results.Created($"/comments/{comment.Id}", comment);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error while adding comment: {ex.Message}");
        return Results.Problem("An error occurred while adding the comment.");
    }
});

app.MapPatch("/comments/{id}", async ([FromServices] CommentService service, int id, [FromBody] Comment updatedComment) =>
{
    try
    {
        service.UpdateComment(id, updatedComment);
        return Results.NoContent();
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error while updating comment: {ex.Message}");
        return Results.Problem("An error occurred while updating the comment.");
    }
});

app.MapDelete("/comments/{id}", async ([FromServices] CommentService service, int id) =>
{
    try
    {
        service.DeleteComment(id);
        return Results.NoContent();
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error while deleting comment: {ex.Message}");
        return Results.Problem("An error occurred while deleting the comment.");
    }
});

// Middleware для логгирования запросов
app.Use(async (context, next) =>
{
    var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();
    logger.LogInformation($"Request: {context.Request.Method} {context.Request.Path}");
    await next();
});

app.Run();