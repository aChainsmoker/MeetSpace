using MeetSpace.Application.Abstractions.Repositories;
using MeetSpace.DataAccess.Context;
using MeetSpace.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace MeetSpace.DataAccess.Repositories;

public class RoomsRepository : IRoomsRepository
{
    private readonly MeetSpaceDbContext _dbContext;

    public RoomsRepository(MeetSpaceDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<Room>> GetAllRoomsAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.Rooms
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }

    public async Task<List<Room>> GetRoomsByIdsAsync(Guid[] ids, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Rooms
            .AsNoTracking()
            .Where(x => ids.Contains(x.Id))
            .ToListAsync(cancellationToken);
    }

    public async Task<Room?> GetRoomByIdAsync(Guid roomId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Rooms
            .AsNoTracking()
            .Include(x=>x.RoomEquipments)
            .FirstOrDefaultAsync(x => x.Id == roomId, cancellationToken);
    }

    public async Task UploadRoomImageAsync(Guid roomId, string photo, CancellationToken cancellationToken = default)
    {
        await _dbContext.Rooms
            .Where(x => x.Id == roomId)
            .ExecuteUpdateAsync(s => s
                .SetProperty(p => p.Photo, photo), cancellationToken);
    }
}