using System.ComponentModel.DataAnnotations;
using System.Data;
using System.Security.Authentication;
using MeetSpace.Application.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace MeetSpace.Api.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;

    public ExceptionHandlingMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await AssignProblemDetailsToResponse(context, ex);
        }
    }

    private static async Task AssignProblemDetailsToResponse(HttpContext context, Exception ex)
    {
        if (context.Response.HasStarted)
        {
            return;
        }
        context.Response.StatusCode = ex switch
        {
            InvalidCredentialException => StatusCodes.Status401Unauthorized,
            UnauthorizedAccessException => StatusCodes.Status401Unauthorized,
            DuplicateEmailException => StatusCodes.Status409Conflict,
            EntityNotFoundException => StatusCodes.Status404NotFound,
            EntityCreatingException => StatusCodes.Status422UnprocessableEntity,
            EntityUpdatingException => StatusCodes.Status422UnprocessableEntity,
            InvalidDataException => StatusCodes.Status400BadRequest,
            _ => StatusCodes.Status500InternalServerError,
        };
            
        await context.Response.WriteAsJsonAsync(
            new ProblemDetails
            {
                Type = ex.GetType().Name,
                Status = context.Response.StatusCode,
                Detail = ex.Message,
                Instance = context.Request.Path,
            });
    }
}