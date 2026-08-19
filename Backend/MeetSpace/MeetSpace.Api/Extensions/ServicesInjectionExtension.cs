using MeetSpace.Application.Abstractions.Auth;
using MeetSpace.Application.Abstractions.Auth.Jwt;
using MeetSpace.Application.Abstractions.Repositories;
using MeetSpace.Application.Abstractions.Repositories.Tokens;
using MeetSpace.Application.Abstractions.Services;
using MeetSpace.Application.Abstractions.Utility;
using MeetSpace.Application.Services;
using MeetSpace.DataAccess.Repositories;
using MeetSpace.DataAccess.Repositories.Tokens;
using MeetSpace.DataAccess.Seeding;
using MeetSpace.Domain.Abstractions.Services;
using MeetSpace.Infrastructure.Auth;
using MeetSpace.Infrastructure.Auth.Jwt;
using MeetSpace.Infrastructure.Auth.Tokens.Services;
using MeetSpace.Infrastructure.Files;

namespace MeetSpace.Api.Extensions;

public static class ServicesInjectionExtension
{
    public static void AddMeetSpaceServices(this IServiceCollection services)
    {
        services.AddScoped<IUsersService, UsersService>();
        services.AddScoped<IRoomService, RoomService>();
        services.AddScoped<IBookingsService, BookingsService>();
        services.AddScoped<IUsersRepository, UsersRepository>();
        services.AddScoped<IRoomsRepository, RoomsRepository>();
        services.AddScoped<IBookingsRepository, BookingsRepository>();
        services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();
        services.AddScoped<IPasswordHasher, PasswordHasher>();
        services.AddScoped<IRefreshTokensService, RefreshTokensService>();
        services.AddScoped<IRefreshTokensRepository, RefreshTokensRepository>();
        services.AddScoped<IRefreshTokenGenerator, RefreshTokenGenerator>();
        services.AddScoped<IEquipmentRepository, EquipmentRepository>();
        services.AddScoped<IEquipmentService, EquipmentService>();
        services.AddScoped<IFileStorageService, S3FileStorageService>();
        services.AddScoped<IBookingsRepositoryHelper, BookingsRepository>();
        services.AddScoped<RoomEquipmentSeeder>();
        services.AddScoped<ManagerUserSeeder>();
        services.AddScoped<BookingsSeeder>();
    }
}