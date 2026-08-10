using System.Text;
using MeetSpace.Infrastructure.Auth.Jwt;
using MeetSpace.Infrastructure.Auth.Tokens.Settings;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace MeetSpace.Api.Extensions.Auth;

public static class AuthenticationExtension
{
    public static void AddAuthenticationWithJwtScheme(this IServiceCollection services,
        IConfiguration configuration)
    {
        var jwtSettings = configuration.GetSection(nameof(JwtSettings)).Get<JwtSettings>();
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(
                JwtBearerDefaults.AuthenticationScheme,
                options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters()
                    {
                        ValidateIssuer = true,
                        ValidIssuer = jwtSettings!.Issuer,
                        ValidateAudience = true,
                        ValidAudience = jwtSettings!.Audience,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings!.SecretKey)),
                    };
                });
    }
}