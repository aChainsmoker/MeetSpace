using System.Security.Authentication;
using MeetSpace.Application.Abstractions.Auth;
using MeetSpace.Application.Abstractions.Auth.Jwt;
using MeetSpace.Application.Abstractions.Repositories;
using MeetSpace.Application.Abstractions.Services;
using MeetSpace.Application.Exceptions;
using MeetSpace.Domain.Abstractions.Services;
using MeetSpace.Domain.Models;

namespace MeetSpace.Application.Services;

public class UsersService : IUsersService
{
    private readonly IUsersRepository _usersRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;
    private readonly IRefreshTokensService _refreshTokensService;

    public UsersService(IUsersRepository usersRepository, IPasswordHasher passwordHasher, IJwtTokenGenerator jwtTokenGenerator, IRefreshTokensService refreshTokensService)
    {
        _usersRepository = usersRepository;
        _passwordHasher = passwordHasher;
        _jwtTokenGenerator = jwtTokenGenerator;
        _refreshTokensService = refreshTokensService;
    }

    public async Task RegisterUserAsync(string firstName, string lastName, string email, string password,
        CancellationToken cancellationToken = default)
    {
        var hashedPassword = _passwordHasher.HashPassword(password);
        var user = new User
        {
            FirstName = firstName,
            LastName = lastName,
            Email = email,
            PasswordHash = hashedPassword,
        };
        
        await _usersRepository.RegisterUserAsync(user, cancellationToken); //TODO: добавить проверку на существующий email
    }

    public async Task<(string, string)> LoginUserAsync(string email, string password, CancellationToken cancellationToken = default)
    {
        var userEntity = await _usersRepository.GetUserByEmailAsync(email, cancellationToken);
        if (userEntity == null)
        {
            throw new InvalidCredentialException("Invalid login or password");
        }
        var loginResult = _passwordHasher.VerifyHashedPassword(password, userEntity.PasswordHash);
        if (!loginResult)
        {
            throw new InvalidCredentialException("Invalid login or password");
        }
        
        var accessToken = _jwtTokenGenerator.GenerateJwtToken(userEntity);
        var refreshToken = await _refreshTokensService.CreateRefreshTokenAsync(userEntity.Id, cancellationToken);
        
        return (accessToken, refreshToken);
    }

    public async Task<string> LoginUserAsync(string refreshToken, CancellationToken cancellationToken = default)
    {
        bool loginResult;
        try
        { 
            loginResult = await _refreshTokensService.ValidateRefreshTokenAsync(refreshToken, cancellationToken);
        }
        catch (EntityNotFoundException)
        {
            throw new UnauthorizedAccessException("Invalid refresh token");
        }
        if (!loginResult)
        {
            await _refreshTokensService.DeleteRefreshTokenAsync(refreshToken, cancellationToken);
            throw new UnauthorizedAccessException("Invalid refresh token");
        }

        var refreshTokenModel = await _refreshTokensService.GetRefreshTokenModelAsync(refreshToken, cancellationToken);
        var userEntity = await _usersRepository.GetUserByIdAsync(refreshTokenModel.UserId, cancellationToken);
        if (userEntity == null)
        {
            throw new EntityNotFoundException("User was not found");
        }
        var accessToken = _jwtTokenGenerator.GenerateJwtToken(userEntity);
        
        return accessToken;
    }

    public async Task<User> GetUserByIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var user = await _usersRepository.GetUserByIdAsync(userId, cancellationToken);
        if (user == null)
        {
            throw new EntityNotFoundException("User was not found");
        }
        
        return user;
    }

    public async Task UpdateUserAsync(User user, CancellationToken cancellationToken = default)
    {
        await _usersRepository.UpdateUserAsync(user, cancellationToken);
    }

    public async Task UpdateUserImageAsync(Guid userId, string image, CancellationToken cancellationToken = default)
    {
        await _usersRepository.UpdateUserImageAsync(userId, image, cancellationToken);
    }
}