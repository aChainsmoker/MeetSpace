using MeetSpace.Api.Contracts.RoomEquipment;

namespace MeetSpace.Api.Contracts.Rooms;

public class GetRoomResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public uint Capacity { get; set; }
    public int Floor { get; set; }
    public string? Description { get; set; }
    public string Photo { get; set; } = null!;
    public List<GetRoomEquipmentResponse> RoomEquipments { get; set; } = [];
}