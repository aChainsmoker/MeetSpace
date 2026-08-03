using MeetSpace.Domain.Models.Tokens;

namespace MeetSpace.Application.Abstractions.Auth;

public interface IRefreshTokenGenerator
{
    string GenerateToken();
    bool VerifyToken(RefreshToken token);
}