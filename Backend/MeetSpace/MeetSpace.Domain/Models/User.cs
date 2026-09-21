namespace MeetSpace.Domain.Models;

public class User
{
    public Guid Id { get; set; }
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string PasswordHash { get; set; } = null!;
    public string? ProfileImage { get; set; } = null;
    public Role Role { get; set; } = null!;
    public Guid RoleId { get; set; }
}