namespace MeetSpace.Infrastructure.Auth.Jwt;

public class JwtSettings
{
    public string SecretKey { get; set; } = null!;
    public int ExpiresInMinutes { get; set; }
    public string Issuer { get; set; } = null!;
    public string Audience { get; set; } = null!;
}