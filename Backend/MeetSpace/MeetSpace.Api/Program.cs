using MeetSpace.Api.Extensions;
using MeetSpace.Api.Extensions.Auth;
using MeetSpace.Api.Extensions.Cors;
using MeetSpace.Api.Extensions.Environment;
using MeetSpace.Api.Extensions.Storage;
using MeetSpace.Api.Mapping;
using MeetSpace.Api.Middleware;
using MeetSpace.DataAccess.Context;
using MeetSpace.DataAccess.Seeding;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<MeetSpaceDbContext>();
builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddSwaggerGen();
builder.Services.AddAuthenticationWithJwtScheme(builder.Configuration);
builder.Services.AddAuthorizationWithDefaultRoles(builder.Configuration);
builder.Services.AddMeetSpaceServices();
builder.Services.AddS3Storage();
builder.Services.ConfigureOptions(builder.Configuration);
builder.Services.AddAutoMapper(cfg => { }, typeof(UserProfile));
var corsPolicyName = builder.Services.AddCorsPolicy(builder.Configuration);

var app = builder.Build();

if (app.Environment.IsDevelopment() || app.Environment.IsDockerEnvironment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
    await app.EnsureS3BucketExistsAsync();
}

if (app.Environment.IsDevelopment() || app.Environment.IsDockerEnvironment() || app.Environment.IsProduction())
{
    using var scope = app.Services.CreateScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<MeetSpaceDbContext>();
    dbContext.Database.Migrate();
    var roomSeeder = scope.ServiceProvider.GetRequiredService<RoomEquipmentSeeder>();
    await roomSeeder.SeedAsync();
    var managerSeeder = scope.ServiceProvider.GetRequiredService<ManagerUserSeeder>();
    await managerSeeder.SeedAsync();
    var bookingsSeeder = scope.ServiceProvider.GetRequiredService<BookingsSeeder>();
    await bookingsSeeder.SeedAsync();
}

app.UseMiddleware<ExceptionHandlingMiddleware>();   
app.UseCors(corsPolicyName);
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.UseHttpsRedirection();
app.Run();