namespace MeetSpace.Application.Abstractions.Services;

public interface IFileStorageService
{
    Task<string> UploadFileAsync(Stream fileStream, string fileName, string contentType, CancellationToken cancellationToken = default);
    Task DeleteFileAsync(string fileKey, CancellationToken cancellationToken = default);
    Task<string> GetPresignedUrlAsync(string fileKey, CancellationToken cancellationToken = default);
}