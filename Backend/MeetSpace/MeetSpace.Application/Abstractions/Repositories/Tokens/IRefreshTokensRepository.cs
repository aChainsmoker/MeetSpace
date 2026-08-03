using MeetSpace.Domain.Models.Tokens;

namespace MeetSpace.Application.Abstractions.Repositories.Tokens;

public interface IRefreshTokensRepository
{
    Task<RefreshToken?> GetRefreshTokenAsync(string token, CancellationToken cancellationToken);
    Task<string> CreateRefreshTokenAsync(RefreshToken refreshToken, CancellationToken cancellationToken);
    Task DeleteRefreshTokenAsync(string token, CancellationToken cancellationToken);
}