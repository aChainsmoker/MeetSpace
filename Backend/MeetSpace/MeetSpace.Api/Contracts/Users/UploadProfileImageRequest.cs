namespace MeetSpace.Api.Contracts.Users;

public class UploadProfileImageRequest
{
    public IFormFile ProfileImage { get; set; } = null!;
}