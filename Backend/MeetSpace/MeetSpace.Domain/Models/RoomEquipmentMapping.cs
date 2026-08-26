namespace MeetSpace.Domain.Models;

public class RoomEquipmentMapping
{
    public Guid RoomEquipmentId { get; set; }
    public RoomEquipment RoomEquipment { get; set; } = null!;
    public Guid RoomId { get; set; }
    public Room Room { get; set; } = null!;
}