using MeetSpace.Application.Settings;
using MeetSpace.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MeetSpace.DataAccess.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    private readonly RolesSettings _rolesSettings;

    public UserConfiguration(RolesSettings rolesSettings)
    {
        _rolesSettings = rolesSettings;
    }

    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasKey(x => x.Id);
        builder
            .Property(x => x.FirstName)
            .IsRequired()
            .HasMaxLength(100);
        builder
            .Property(x => x.LastName)
            .IsRequired()
            .HasMaxLength(100);
        builder
            .Property(x => x.Email)
            .IsRequired()
            .HasMaxLength(100);
        builder
            .HasIndex(x => x.Email)
            .IsUnique();
        builder
            .Property(x => x.PasswordHash)
            .IsRequired();
        builder
            .Property(x => x.ProfileImage)
            .IsRequired(false);
        builder
            .HasOne(x => x.Role)
            .WithMany()
            .HasForeignKey(x => x.RoleId)
            .OnDelete(DeleteBehavior.Cascade);
        builder
            .Property(x => x.RoleId)
            .HasDefaultValue(_rolesSettings.DefaultRoleId);
        builder
            .HasMany<Booking>()
            .WithOne(x => x.User)
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}