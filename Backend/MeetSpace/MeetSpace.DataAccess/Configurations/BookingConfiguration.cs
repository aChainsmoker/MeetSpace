using MeetSpace.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MeetSpace.DataAccess.Configurations;

public class BookingConfiguration : IEntityTypeConfiguration<Booking>
{
    public void Configure(EntityTypeBuilder<Booking> builder)
    {
        builder.HasKey(x=>x.Id);
        builder
            .Property(x=>x.Title)
            .IsRequired()
            .HasMaxLength(100);
        builder
            .Property(x=>x.Description)
            .IsRequired(false)
            .HasMaxLength(500);
        builder
            .Property(x=>x.StartOfBookingTime)
            .IsRequired();
        builder
            .Property(x=>x.EndOfBookingTime)
            .IsRequired();
        builder
            .HasOne(x => x.User)
            .WithMany()
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);
        builder
            .HasOne(x=>x.Room)
            .WithMany()
            .HasForeignKey(x=>x.RoomId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}