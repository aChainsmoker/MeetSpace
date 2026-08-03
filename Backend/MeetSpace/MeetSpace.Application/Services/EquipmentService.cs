using MeetSpace.Application.Abstractions.Repositories;
using MeetSpace.Domain.Abstractions.Services;
using MeetSpace.Domain.Models;

namespace MeetSpace.Application.Services;

public class EquipmentService : IEquipmentService
{
    private readonly IEquipmentRepository _equipmentRepository;

    public EquipmentService(IEquipmentRepository equipmentRepository)
    {
        _equipmentRepository = equipmentRepository;
    }
    
    public async Task<List<RoomEquipment>> GetEquipmentListAsync(CancellationToken cancellationToken = default)
    {
        return await _equipmentRepository.GetEquipmentListAsync(cancellationToken);
    }
}