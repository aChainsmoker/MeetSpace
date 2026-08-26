using MeetSpace.Domain.Models;

namespace MeetSpace.Domain.Abstractions.Services;

public interface IEquipmentService
{
    Task<List<RoomEquipment>> GetEquipmentListAsync(CancellationToken cancellationToken = default);
}