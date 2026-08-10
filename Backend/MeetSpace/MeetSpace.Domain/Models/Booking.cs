namespace MeetSpace.Domain.Models;

public class Booking
{
    public Guid Id { get; set; }
    public string Title { get; set; } = null!;
    public string? Description { get; set; } = null;
    public User User { get; set; } = null!;
    public Guid UserId { get; set; }
    public Room Room { get; set; } = null!;
    public Guid RoomId { get; set; }
    public DateOnly BookingDate {get; set;}
    public TimeOnly StartOfBookingTime { get; set; }
    public TimeOnly EndOfBookingTime { get; set; }
}