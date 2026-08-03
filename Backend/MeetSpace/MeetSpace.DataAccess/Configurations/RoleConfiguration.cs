using MeetSpace.Application.Settings;
using MeetSpace.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MeetSpace.DataAccess.Configurations;

public class RoleConfiguration : IEntityTypeConfiguration<Role>
{
    private readonly RolesSettings _rolesSettings;

    public RoleConfiguration(RolesSettings rolesSettings)
    {
        _rolesSettings = rolesSettings;
    }

    public void Configure(EntityTypeBuilder<Role> builder)
    {
        builder
            .HasKey(x => x.Id);
        builder
            .Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(50);
        builder
            .HasMany<User>()
            .WithOne(x => x.Role)
            .HasForeignKey(x => x.RoleId)
            .OnDelete(DeleteBehavior.Cascade);
        builder
            .HasData([_rolesSettings.User, _rolesSettings.Manager]);
    }
}