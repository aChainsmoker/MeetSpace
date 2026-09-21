namespace MeetSpace.Api.Contracts.Rooms;

public class UploadRoomPhotoRequest
{
    public IFormFile Image { get; set; } = null!;
}