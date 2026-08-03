using MeetSpace.Domain.Models;

namespace MeetSpace.Application.Abstractions.Auth.Jwt;

public interface IJwtTokenGenerator
{
    string GenerateJwtToken(User user);
}