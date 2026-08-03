using MeetSpace.Application.Abstractions.Auth;
using MeetSpace.Application.Abstractions.Repositories.Tokens;
using MeetSpace.Application.Abstractions.Services;
using MeetSpace.Application.Exceptions;
using MeetSpace.Domain.Models.Tokens;
using MeetSpace.Infrastructure.Auth.Tokens.Settings;
using Microsoft.Extensions.Options;

namespace MeetSpace.Infrastructure.Auth.Tokens.Services;

public class RefreshTokensService : IRefreshTokensService
{
    private readonly IRefreshTokenGenerator _refreshTokenGenerator;
    private readonly IRefreshTokensRepository _refreshTokensRepository;
    private readonly RefreshTokenSettings _refreshTokenSettings;

    public RefreshTokensService(IRefreshTokenGenerator refreshTokenGenerator, IRefreshTokensRepository refreshTokensRepository, IOptions<RefreshTokenSettings> refreshTokenSettings)
    {
        _refreshTokenGenerator = refreshTokenGenerator;
        _refreshTokensRepository = refreshTokensRepository;
        _refreshTokenSettings = refreshTokenSettings.Value;
    }

    public async Task<string> CreateRefreshTokenAsync(Guid userId, CancellationToken cancellationToken)
    {
        var token = new RefreshToken
        {
            Token = _refreshTokenGenerator.GenerateToken(),
            UserId = userId,
            ExpiresAt = DateTime.UtcNow.AddDays(_refreshTokenSettings.ExpiresInDays)
        };
        
        return await _refreshTokensRepository.CreateRefreshTokenAsync(token, cancellationToken);
    }

    public async Task DeleteRefreshTokenAsync(string token, CancellationToken cancellationToken)
    {
        await _refreshTokensRepository.DeleteRefreshTokenAsync(token, cancellationToken);
    }

    public async Task<bool> ValidateRefreshTokenAsync(string token, CancellationToken cancellationToken)
    {
        var tokenEntity = await _refreshTokensRepository.GetRefreshTokenAsync(token, cancellationToken);
        if (tokenEntity == null)
        {
            throw new EntityNotFoundException("Token entity was not found");
        }

        return _refreshTokenGenerator.VerifyToken(tokenEntity);
    }

    public async Task<RefreshToken> GetRefreshTokenModelAsync(string token, CancellationToken cancellationToken)
    {
        var tokenEntity = await _refreshTokensRepository.GetRefreshTokenAsync(token, cancellationToken);
        if (tokenEntity == null)
        {
            throw new EntityNotFoundException("Token entity was not found");
        }

        return tokenEntity;
    }
}