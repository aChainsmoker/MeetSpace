using MeetSpace.Domain.Models;

namespace MeetSpace.Application.Abstractions.Repositories;

public interface IUsersRepository
{
    Task<User?> GetUserByEmailAsync(string email, CancellationToken cancellationToken = default);
    Task<User?> GetUserByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task RegisterUserAsync(User user, CancellationToken cancellationToken = default);
    Task UpdateUserAsync(User user, CancellationToken cancellationToken = default);
    Task UpdateUserImageAsync(Guid userId, string image, CancellationToken cancellationToken = default);
}