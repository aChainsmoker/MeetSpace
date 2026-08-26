using MeetSpace.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MeetSpace.DataAccess.Configurations;

public class RoomConfiguration : IEntityTypeConfiguration<Room>
{
    public void Configure(EntityTypeBuilder<Room> builder)
    {
        builder.HasKey(x => x.Id);
        builder
            .Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(100);
        builder
            .Property(x => x.Description)
            .IsRequired(false)
            .HasMaxLength(500);
        builder
            .Property(x => x.Capacity)
            .IsRequired();
        builder
            .Property(x => x.Floor)
            .IsRequired();
        builder
            .Property(x => x.Photo)
            .IsRequired(false);
        builder
            .HasMany<Booking>()
            .WithOne(x => x.Room)
            .HasForeignKey(x => x.RoomId)
            .OnDelete(DeleteBehavior.Cascade);
        builder
            .HasMany(x => x.RoomEquipments)
            .WithMany()
            .UsingEntity<RoomEquipmentMapping>(
            x => x
                .HasOne(e => e.RoomEquipment)
                .WithMany()
                .HasForeignKey(e => e.RoomId)
                .OnDelete(DeleteBehavior.Cascade),
            x => x
                .HasOne(r => r.Room)
                .WithMany()
                .HasForeignKey(r => r.RoomId)
                .OnDelete(DeleteBehavior.Cascade)
        );
    }
}