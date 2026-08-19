using MeetSpace.Application.Abstractions.Repositories;
using MeetSpace.Application.Abstractions.Services;
using MeetSpace.Application.Exceptions;
using MeetSpace.Domain.Abstractions.Services;
using MeetSpace.Domain.Models;

namespace MeetSpace.Application.Services;

public class RoomService : IRoomService
{
    private readonly IRoomsRepository _roomsRepository;
    private readonly IFileStorageService _fileStorageService;

    public RoomService(IRoomsRepository roomsRepository, IFileStorageService fileStorageService)
    {
        _roomsRepository = roomsRepository;
        _fileStorageService = fileStorageService;
    }
    
    public async Task<List<Room>> GetAllRoomsAsync(CancellationToken cancellationToken = default)
    {
        var rooms = await _roomsRepository.GetAllRoomsAsync(cancellationToken);
        await GetUrlImageForRoomsAsync(rooms, cancellationToken);
        
        return rooms;
    }

    public async Task<List<Room>> GetRoomsByIdsAsync(Guid[] ids, CancellationToken cancellationToken = default)
    {
        var rooms = await _roomsRepository.GetRoomsByIdsAsync(ids, cancellationToken);
        await GetUrlImageForRoomsAsync(rooms, cancellationToken);
        
        return rooms;
    }

    public async Task<Room> GetRoomByIdAsync(Guid roomId, CancellationToken cancellationToken = default)
    {
        var room = await _roomsRepository.GetRoomByIdAsync(roomId, cancellationToken);
        if (room == null)
        {
            throw new EntityNotFoundException("Room was not found");
        }
        await GetUrlImageForRoomsAsync([room], cancellationToken);
        
        return room;
    }

    public async Task UploadRoomImageAsync(Guid roomId, string photo, CancellationToken cancellationToken = default)
    {
        var room = await _roomsRepository.GetRoomByIdAsync(roomId, cancellationToken);
        if (room?.Photo != null)
        {
            await _fileStorageService.DeleteFileAsync(room.Photo, cancellationToken);
        }
        await _roomsRepository.UploadRoomImageAsync(roomId, photo, cancellationToken);
    }
    
    private async Task GetUrlImageForRoomsAsync(List<Room> rooms, CancellationToken cancellationToken = default)
    {
        foreach (var room in rooms)
        {
            if (room.Photo == null)
            {
                continue;
            }

            room.Photo = await _fileStorageService.GetPresignedUrlAsync(room.Photo, cancellationToken);
        }
    }

}