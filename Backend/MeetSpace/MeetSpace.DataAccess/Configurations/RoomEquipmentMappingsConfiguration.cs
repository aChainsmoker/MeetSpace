using MeetSpace.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MeetSpace.DataAccess.Configurations;

public class RoomEquipmentMappingsConfiguration : IEntityTypeConfiguration<RoomEquipmentMapping>
{
    public void Configure(EntityTypeBuilder<RoomEquipmentMapping> builder)
    {
        builder.HasKey(x => new { x.RoomId, x.RoomEquipmentId });
        builder.HasOne(x => x.Room)
            .WithMany()
            .HasForeignKey(x => x.RoomId)
            .OnDelete(DeleteBehavior.Cascade);
        builder.HasOne(x => x.RoomEquipment)
            .WithMany()
            .HasForeignKey(x => x.RoomEquipmentId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}