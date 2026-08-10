using MeetSpace.Api.Contracts.Rooms;
using MeetSpace.Api.Contracts.Users;
using MeetSpace.Domain.Models;

namespace MeetSpace.Api.Contracts.Bookings;

public class GetBookingResponse
{
    public Guid Id { get; set; }
    public GetRoomResponse Room { get; set; } = null!;
    public Guid UserId { get; set; }
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public TimeOnly StartOfBookingTime { get; set; }
    public TimeOnly EndOfBookingTime { get; set; }
    public DateOnly BookingDate { get; set; }
}