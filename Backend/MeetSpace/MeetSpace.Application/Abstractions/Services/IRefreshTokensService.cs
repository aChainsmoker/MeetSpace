using MeetSpace.Domain.Models.Tokens;

namespace MeetSpace.Application.Abstractions.Services;

public interface IRefreshTokensService
{
    Task<string> CreateRefreshTokenAsync(Guid userId, CancellationToken cancellationToken = default);
    Task DeleteRefreshTokenAsync(string token, CancellationToken cancellationToken = default);
    Task<bool> ValidateRefreshTokenAsync(string token, CancellationToken cancellationToken = default);
    Task<RefreshToken> GetRefreshTokenModelAsync(string token, CancellationToken cancellationToken = default);
}