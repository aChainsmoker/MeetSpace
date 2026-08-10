namespace MeetSpace.Api.Contracts.Auth;

public class RefreshTokenRequest
{
    public string RefreshToken { get; set; } = null!;
}