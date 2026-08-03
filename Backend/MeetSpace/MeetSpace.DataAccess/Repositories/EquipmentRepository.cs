using MeetSpace.Application.Abstractions.Repositories;
using MeetSpace.DataAccess.Context;
using MeetSpace.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace MeetSpace.DataAccess.Repositories;

public class EquipmentRepository : IEquipmentRepository
{
    private readonly MeetSpaceDbContext _dbContext;

    public EquipmentRepository(MeetSpaceDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    
    public async Task<List<RoomEquipment>> GetEquipmentListAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.RoomEquipments
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }
}