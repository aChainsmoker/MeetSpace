using AutoMapper;
using MeetSpace.Api.Contracts;
using MeetSpace.Api.Contracts.Users;
using MeetSpace.Domain.Models;

namespace MeetSpace.Api.Mapping;

public class UserProfile : Profile
{
    public UserProfile()
    {
        CreateMap<UpdateUserRequest, User>();
        CreateMap<User, GetUserResponse>()
            .ForMember(dest => dest.ProfileImageKey, 
                opt => opt.MapFrom(src => src.ProfileImage));
    }
}