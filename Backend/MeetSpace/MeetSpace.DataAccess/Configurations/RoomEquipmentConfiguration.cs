using MeetSpace.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MeetSpace.DataAccess.Configurations;

public class RoomEquipmentConfiguration : IEntityTypeConfiguration<RoomEquipment>
{
    public void Configure(EntityTypeBuilder<RoomEquipment> builder)
    {
        builder.HasKey(x => x.Id);
        builder
            .Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(100);
    }
}