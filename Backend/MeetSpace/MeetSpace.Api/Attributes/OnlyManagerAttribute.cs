using MeetSpace.Api.Utility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Filters;

namespace MeetSpace.Api.Attributes;

public class OnlyManagerAttribute : AuthorizeAttribute
{
    public OnlyManagerAttribute()
    {
        Policy = RolePolicies.OnlyManger;
    }
}