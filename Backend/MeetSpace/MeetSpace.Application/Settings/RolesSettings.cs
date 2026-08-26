using MeetSpace.Domain.Models;

namespace MeetSpace.Application.Settings;

public class RolesSettings
{
    public Role User { get; set; } = null!;
    public Role Manager { get; set; } = null!;
    public Guid DefaultRoleId { get; set; }
}