namespace MeetSpace.Domain.Models;

public class Room
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public uint Capacity { get; set; }
    public int Floor { get; set; }
    public string? Description { get; set; } = null;
    public bool IsActive { get; set; }
    public string? Photo { get; set; } = null;
    public List<RoomEquipment> RoomEquipments { get; set; } = [];
}