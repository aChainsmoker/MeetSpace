namespace MeetSpace.Api.Contracts.Users;

public class AuthLoginRequest
{
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
    public bool RememberMe { get; set; }
}