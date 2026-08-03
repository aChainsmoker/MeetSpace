namespace MeetSpace.Domain.Models;

public class BookingsFilter
{
    public string? RoomSearchQuery { get; set; } = null!;
    public uint? Capacity { get; set; }
    public DateOnly? StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public TimeOnly? StartTime { get; set; }
    public TimeOnly? EndTime { get; set; }
    public List<Guid> RoomEquipmentsIds { get; set; } = [];
}