namespace MeetSpace.Application.Abstractions.Auth;

public interface IPasswordHasher
{
    string HashPassword(string password);
    bool VerifyHashedPassword(string providedPassword, string hashedPassword);
}