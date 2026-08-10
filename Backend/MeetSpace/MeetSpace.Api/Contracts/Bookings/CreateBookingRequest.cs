namespace MeetSpace.Api.Contracts.Bookings;

public class CreateBookingRequest
{
    public Guid UserId { get; set; }
    public Guid RoomId { get; set; }
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public TimeOnly StartOfBookingTime { get; set; }
    public TimeOnly EndOfBookingTime { get; set; }
    public DateOnly BookingDate { get; set; }
}