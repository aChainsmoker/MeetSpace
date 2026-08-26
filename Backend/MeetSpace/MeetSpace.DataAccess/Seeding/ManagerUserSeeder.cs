using MeetSpace.Application.Abstractions.Auth;
using MeetSpace.DataAccess.Context;
using MeetSpace.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace MeetSpace.DataAccess.Seeding;

public class ManagerUserSeeder
{
    private readonly MeetSpaceDbContext _dbContext;
    private readonly IPasswordHasher _passwordHasher;

    public ManagerUserSeeder(MeetSpaceDbContext dbContext, IPasswordHasher passwordHasher)
    {
        _dbContext = dbContext;
        _passwordHasher = passwordHasher;
    }

    public async Task SeedAsync(CancellationToken cancellationToken = default)
    {
        if (await _dbContext.Users.AnyAsync(cancellationToken))
        {
            return;
        }

        var manager = new User
        {
            Id = Guid.NewGuid(),
            FirstName = "Manager",
            LastName = "Managerovich",
            Email = "manager@manager.com",
            PasswordHash = _passwordHasher.HashPassword("manager"),
            RoleId = new Guid("7cfd6b8e-4289-4f97-911d-b24bb5608f68")
        };
        
        await _dbContext.Users.AddAsync(manager, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}