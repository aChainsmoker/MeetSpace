using MeetSpace.DataAccess.Context;
using MeetSpace.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace MeetSpace.DataAccess.Seeding;

public class RoomEquipmentSeeder
{
    private readonly MeetSpaceDbContext _dbContext;
    private readonly SeedingOptions _options;

    public RoomEquipmentSeeder(
        MeetSpaceDbContext dbContext,
        IOptions<SeedingOptions> options)
    {
        _dbContext = dbContext;
        _options = options.Value;
    }

    public async Task SeedAsync(CancellationToken cancellationToken = default)
    {
        if (await _dbContext.Rooms.AnyAsync(cancellationToken))
        {
            return;
        }

        var rooms = _options.Rooms
            .Select(r => new Room
            {
                Id = Guid.NewGuid(),
                Name = r.Name,
                Capacity = r.Capacity,
                Floor = r.Floor,
                Description = r.Description,
            })
            .ToList();

        await _dbContext.Rooms.AddRangeAsync(rooms, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);

        var equipmentList = _options.Equipment
            .Select(e => new RoomEquipment
            {
                Id = Guid.NewGuid(),
                Name = e.Name
            })
            .ToList();

        await _dbContext.RoomEquipments.AddRangeAsync(equipmentList, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);

        var mappings = new List<RoomEquipmentMapping>();

        foreach (var mappingConfig in _options.Mappings)
        {
            var room = rooms.FirstOrDefault(r => r.Name == mappingConfig.RoomName);
            var equipment = equipmentList.FirstOrDefault(e => e.Name == mappingConfig.EquipmentName);

            if (room != null && equipment != null)
            {
                mappings.Add(new RoomEquipmentMapping
                {
                    RoomId = room.Id,
                    RoomEquipmentId = equipment.Id
                });
            }
        }

        if (mappings.Any())
        {
            await _dbContext.RoomEquipmentMappings.AddRangeAsync(mappings, cancellationToken);
            await _dbContext.SaveChangesAsync(cancellationToken);
        }
    }
}