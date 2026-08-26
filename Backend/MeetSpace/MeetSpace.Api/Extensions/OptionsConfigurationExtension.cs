using MeetSpace.Api.Settings;
using MeetSpace.Application.Settings;
using MeetSpace.DataAccess.Seeding;
using MeetSpace.Infrastructure.Auth.Jwt;
using MeetSpace.Infrastructure.Auth.Tokens.Settings;
using MeetSpace.Infrastructure.Files;

namespace MeetSpace.Api.Extensions;

public static class OptionsConfigurationExtension
{
    public static void ConfigureOptions(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<RefreshTokenSettings>(configuration.GetSection(nameof(RefreshTokenSettings)));
        services.Configure<RolesSettings>(configuration.GetSection(nameof(RolesSettings)));
        services.Configure<JwtSettings>(configuration.GetSection(nameof(JwtSettings)));
        services.Configure<CorsSettings>(configuration.GetSection(nameof(CorsSettings)));
        services.Configure<SeedingOptions>(configuration.GetSection(nameof(SeedingOptions)));
        services.Configure<S3StorageSettings>(configuration.GetSection(nameof(S3StorageSettings)));
        services.Configure<BookingSettings>(configuration.GetSection(nameof(BookingSettings)));
        services.Configure<RolePoliciesSettings>(configuration.GetSection(nameof(RolePoliciesSettings)));
    }
}