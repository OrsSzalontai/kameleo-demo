using Microsoft.AspNetCore.Diagnostics;
using System.Net;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();
app.UseHttpsRedirection();

// ------------------------------------------------------
// Global exception handler
// ------------------------------------------------------
app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        var exceptionHandler = context.Features.Get<IExceptionHandlerFeature>();
        var exception = exceptionHandler?.Error;

        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
        context.Response.ContentType = "application/json";

        var traceId = context.TraceIdentifier;

        var response = new
        {
            error = new
            {
                code = "UNEXPECTED_ERROR",
                message = "Something went wrong. Please try again later.",
                traceId
            }
        };

        await context.Response.WriteAsJsonAsync(response);
    });
});

// ------------------------------------------------------
// Demo endpoints
// ------------------------------------------------------

app.MapGet("/api/demo/success", () =>
{
    return Results.Ok();
})
.Produces(StatusCodes.Status200OK);

app.MapGet("/api/demo/error", () =>
{
    var traceId = Guid.NewGuid().ToString();

    return Results.Problem(
        statusCode: StatusCodes.Status500InternalServerError,
        title: "Internal Server Error",
        detail: "An unexpected error occurred while processing your request.",
        extensions: new Dictionary<string, object?>
        {
            ["code"] = "INTERNAL_ERROR",
            ["traceId"] = traceId
        }
    );
})
.ProducesProblem(StatusCodes.Status500InternalServerError);

app.MapGet("/api/demo/upgrade", () =>
{
    var traceId = Guid.NewGuid().ToString();

    return Results.Json(
        new
        {
            error = new
            {
                code = "PLAN_UPGRADE_REQUIRED",
                message = "Your current plan does not allow this action.",
                traceId,
                details = new
                {
                    requiredPlan = "Pro"
                }
            }
        },
        statusCode: StatusCodes.Status402PaymentRequired
    );
})
.Produces(StatusCodes.Status402PaymentRequired);

app.Run();
