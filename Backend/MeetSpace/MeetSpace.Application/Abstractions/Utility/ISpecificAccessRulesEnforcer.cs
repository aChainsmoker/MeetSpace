namespace MeetSpace.Application.Abstractions.Utility;

public interface ISpecificAuthorizationRulesEnforcer
{
    void CheckIfUserOwnsDataOrHasRightsToModifyIt(Guid dataOwnerId);
}