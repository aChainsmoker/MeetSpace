using MeetSpace.Domain.Models;

namespace MeetSpace.Domain.Abstractions.Services;

public interface IUsersService
{
    Task RegisterUserAsync(string firstName, string lastName, string email, string password, CancellationToken cancellationToken = default);
    Task<(string, string)> LoginUserAsync(string email, string password, CancellationToken cancellationToken = default);
    Task<string> LoginUserAsync(string refreshToken, CancellationToken cancellationToken = default);
    Task<User> GetUserByIdAsync(Guid userId, CancellationToken cancellationToken = default);
    Task UpdateUserAsync(User user, CancellationToken cancellationToken = default);
    Task UpdateUserImageAsync(Guid userId, string image, CancellationToken cancellationToken = default);
}