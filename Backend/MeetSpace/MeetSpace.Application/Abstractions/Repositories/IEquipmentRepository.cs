using MeetSpace.Domain.Models;

namespace MeetSpace.Application.Abstractions.Repositories;

public interface IEquipmentRepository
{
    Task<List<RoomEquipment>> GetEquipmentListAsync(CancellationToken cancellationToken = default);
}