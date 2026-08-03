using System.Security.Cryptography;
using MeetSpace.Application.Abstractions.Auth;
using MeetSpace.Domain.Models.Tokens;

namespace MeetSpace.Infrastructure.Auth;

public class RefreshTokenGenerator : IRefreshTokenGenerator
{
    public string GenerateToken()
    {
        return Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));
    }

    public bool VerifyToken(RefreshToken token)
    {
        return token.ExpiresAt >= DateTime.UtcNow;
    }
}