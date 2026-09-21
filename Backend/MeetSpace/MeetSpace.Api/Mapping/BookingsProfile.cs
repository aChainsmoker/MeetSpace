using AutoMapper;
using MeetSpace.Api.Contracts.Bookings;
using MeetSpace.Domain.Models;

namespace MeetSpace.Api.Mapping;

public class BookingsProfile : Profile
{
    public BookingsProfile()
    {
        CreateMap<Booking, GetBookingResponse>();
        CreateMap<CreateBookingRequest, Booking>();
        CreateMap<UpdateBookingRequest, Booking>();
    }
}