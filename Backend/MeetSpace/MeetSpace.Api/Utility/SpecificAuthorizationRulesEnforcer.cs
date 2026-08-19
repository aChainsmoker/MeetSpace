using System.Security.Claims;
using MeetSpace.Api.Exceptions;
using MeetSpace.Api.Settings;
using MeetSpace.Application.Abstractions.Utility;
using Microsoft.Extensions.Options;

namespace MeetSpace.Api.Utility;

public class SpecificAuthorizationRulesEnforcer : ISpecificAuthorizationRulesEnforcer
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly RolePoliciesSettings _rolePoliciesSettings;

    public SpecificAuthorizationRulesEnforcer(IHttpContextAccessor httpContextAccessor, IOptions<RolePoliciesSettings> rolePoliciesSettings)
    {
        _httpContextAccessor = httpContextAccessor;
        _rolePoliciesSettings = rolePoliciesSettings.Value;
    }
    
    public void CheckIfUserOwnsDataOrHasRightsToModifyIt(Guid dataOwnerId)
    {
        if (_httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value != dataOwnerId.ToString() || 
            !_rolePoliciesSettings.OnlyManager.AllowedRoles.Contains(_httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.Role)?.Value))
        {
            throw new ForbidException("You do not have access to this data");
        }
    }
}