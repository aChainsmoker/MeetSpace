using MeetSpace.Domain.Models;

namespace MeetSpace.Api.Contracts.Users;

public class GetUserResponse
{
    public Guid Id { get; set; }
    public Role Role { get; set; } = null!;
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string ProfileImageKey { get; set; } = null!;
}