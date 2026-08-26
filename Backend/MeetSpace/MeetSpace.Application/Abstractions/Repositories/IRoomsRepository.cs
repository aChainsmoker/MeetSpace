using MeetSpace.Domain.Models;

namespace MeetSpace.Application.Abstractions.Repositories;

public interface IRoomsRepository
{
    Task<List<Room>> GetAllRoomsAsync(CancellationToken cancellationToken = default);
    Task<List<Room>> GetRoomsByIdsAsync(Guid[] ids, CancellationToken cancellationToken = default);
    Task<Room?> GetRoomByIdAsync(Guid roomId, CancellationToken cancellationToken = default);
    Task UploadRoomImageAsync(Guid roomId, string photo, CancellationToken cancellationToken = default);
}