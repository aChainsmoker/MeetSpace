namespace MeetSpace.Api.Contracts.Rooms;

public class RoomImageResponse
{
    public Dictionary<Guid, string> ImageUrls { get; set; } = [];
}