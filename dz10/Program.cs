using CommentApi.Models;
using CommentApi.Repositories;
using CommentApi.Services;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<ICommentRepository, CommentRepository>();
builder.Services.AddSingleton<CommentService>();
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

app.MapGet("/comments", ([FromServices] CommentService service) =>
{
    var comments = service.GetAllComments();
    return Results.Ok(comments);
});

app.MapGet("/comments/{id}", ([FromServices] CommentService service, int id) =>
{
    var comment = service.GetCommentById(id);
    return comment is not null ? Results.Ok(comment) : Results.NotFound();
});

app.MapPost("/comments", ([FromServices] CommentService service, [FromBody] Comment comment) =>
{
    service.AddComment(comment);
    return Results.Created($"/comments/{comment.Id}", comment);
});

app.MapPatch("/comments/{id}", ([FromServices] CommentService service, int id, [FromBody] Comment updatedComment) =>
{
    service.UpdateComment(id, updatedComment);
    return Results.NoContent();
});

app.MapDelete("/comments/{id}", ([FromServices] CommentService service, int id) =>
{
    service.DeleteComment(id);
    return Results.NoContent();
});

app.Run();