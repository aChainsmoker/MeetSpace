using MeetSpace.Application.Abstractions.Repositories.Tokens;
using MeetSpace.DataAccess.Context;
using MeetSpace.Domain.Models.Tokens;
using Microsoft.EntityFrameworkCore;

namespace MeetSpace.DataAccess.Repositories.Tokens;

public class RefreshTokensRepository : IRefreshTokensRepository
{
    private readonly MeetSpaceDbContext _dbContext;

    public RefreshTokensRepository(MeetSpaceDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    public async Task<string> CreateRefreshTokenAsync(RefreshToken refreshToken, CancellationToken cancellationToken)
    {
        await _dbContext.AddAsync(refreshToken, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
        
        return refreshToken.Token;
    }

    public async Task DeleteRefreshTokenAsync(string token, CancellationToken cancellationToken)
    {
        await _dbContext.RefreshTokens
            .Where(r=>r.Token == token)
            .ExecuteDeleteAsync(cancellationToken);
    }

    public async Task<RefreshToken?> GetRefreshTokenAsync(string token, CancellationToken cancellationToken)
    {
        var refreshTokenEntity = await _dbContext.RefreshTokens
            .AsNoTracking()
            .FirstOrDefaultAsync(r => r.Token == token, cancellationToken);
        
        return refreshTokenEntity;
    }
}