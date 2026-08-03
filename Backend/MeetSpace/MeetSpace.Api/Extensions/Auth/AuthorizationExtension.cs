using MeetSpace.Api.Settings;
using MeetSpace.Api.Utility;

namespace MeetSpace.Api.Extensions.Auth;

public static class AuthorizationExtension
{
    public static void AddAuthorizationWithDefaultRoles(this IServiceCollection services, IConfiguration configuration)
    {
        var defaultPolicies = configuration.GetSection(nameof(RolePoliciesSettings)).Get<RolePoliciesSettings>();
        if (defaultPolicies == null)
        {
            throw new ArgumentNullException(nameof(defaultPolicies), "Default role policies are missing.");
        }

        services
            .AddAuthorizationBuilder()
            .AddPolicy(defaultPolicies.OnlyManager.Name,
                policy => policy.RequireRole(defaultPolicies.OnlyManager.AllowedRoles));

        RolePolicies.Initialize(defaultPolicies);
    }
}