using MeetSpace.Api.Settings;

namespace MeetSpace.Api.Utility;

public static class RolePolicies
{
    public static string OnlyManger = null!;
    
    public static void Initialize(RolePoliciesSettings settings)
    {
        OnlyManger = settings.OnlyManager.Name;
    }
}