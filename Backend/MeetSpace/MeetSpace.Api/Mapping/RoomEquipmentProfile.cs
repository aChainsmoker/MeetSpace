using AutoMapper;
using MeetSpace.Api.Contracts.RoomEquipment;
using MeetSpace.Domain.Models;

namespace MeetSpace.Api.Mapping;

public class RoomEquipmentProfile : Profile
{
    public RoomEquipmentProfile()
    {
        CreateMap<RoomEquipment, GetRoomEquipmentResponse>();
    }
}