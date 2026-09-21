using AutoMapper;
using MeetSpace.Api.Contracts.Rooms;
using MeetSpace.Domain.Models;

namespace MeetSpace.Api.Mapping;

public class RoomProfile : Profile
{
    public RoomProfile()
    {
        CreateMap<Room, GetRoomResponse>();
    }
}