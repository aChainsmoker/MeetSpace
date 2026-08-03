namespace MeetSpace.Api.Contracts.Bookings;

public class UpdateBookingRequest
{
    public Guid UserId { get; set; }
    public Guid RoomId { get; set; }
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public DateTime StartOfBookingTime { get; set; }
    public DateTime EndOfBookingTime { get; set; }
}