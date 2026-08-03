using MeetSpace.Application.Abstractions.Repositories;
using MeetSpace.DataAccess.Context;
using MeetSpace.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace MeetSpace.DataAccess.Repositories;

public class UsersRepository : IUsersRepository
{
    private readonly MeetSpaceDbContext _dbContext;

    public UsersRepository(MeetSpaceDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<User?> GetUserByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Users
            .AsNoTracking()
            .Include(x => x.Role)
            .FirstOrDefaultAsync(x => x.Email == email, cancellationToken);
    }

    public async Task<User?> GetUserByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Users
            .AsNoTracking()
            .Include(x => x.Role)
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task RegisterUserAsync(User user, CancellationToken cancellationToken = default)
    {
        await _dbContext.Users.AddAsync(user, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateUserAsync(User user, CancellationToken cancellationToken = default)
    {
        var userEntry = _dbContext.Users.Update(user);
        userEntry.Property(x => x.RoleId).IsModified = false;
        userEntry.Property(x => x.PasswordHash).IsModified = false;
        userEntry.Property(x => x.ProfileImage).IsModified = false;
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateUserImageAsync(Guid userId, string image, CancellationToken cancellationToken = default)
    {
        await _dbContext.Users
            .Where(x => x.Id == userId)
            .ExecuteUpdateAsync(x => x.
                SetProperty(p => p.ProfileImage, image), cancellationToken);
    }
}