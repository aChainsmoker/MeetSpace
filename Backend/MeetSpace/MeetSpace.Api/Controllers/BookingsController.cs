using System.Security.Claims;
using AutoMapper;
using MeetSpace.Api.Contracts.Bookings;
using MeetSpace.Domain.Abstractions.Services;
using MeetSpace.Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MeetSpace.Api.Controllers;

[ApiController]
[Route("/api/[controller]")]
public class BookingsController : ControllerBase
{
    private readonly IBookingsService _bookingsService;
    private readonly IMapper _mapper;
    private readonly IRoomService _roomService;

    public BookingsController(IBookingsService bookingsService, IMapper mapper, IRoomService roomService)
    {
        _bookingsService = bookingsService;
        _roomService = roomService;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<List<GetBookingResponse>>> GetBookingsAsync([FromQuery]BookingsFilter filter, CancellationToken cancellationToken = default)
    {
        var bookings = await _bookingsService.GetBookingsAsync(filter, cancellationToken);
        var rooms = await _roomService.GetRoomsByIdsAsync(bookings.Select(b => b.RoomId).ToArray(), cancellationToken);
        CorrelateRoomsAndBookings(rooms, bookings);
        
        var response = _mapper.Map<List<GetBookingResponse>>(bookings);
        
        return Ok(response);
    }
    
    [HttpGet("{id}")]
    public async Task<ActionResult<GetBookingResponse>> GetBookingAsync([FromRoute]Guid id, CancellationToken cancellationToken = default)
    {
        var bookings = await _bookingsService.GetBookingByIdAsync(id, cancellationToken);
        var response = _mapper.Map<GetBookingResponse>(bookings);
        
        return Ok(response);
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult> CreateBookingAsync([FromBody] CreateBookingRequest bookingRequest, CancellationToken cancellationToken = default)
    {
        var booking = _mapper.Map<Booking>(bookingRequest);
        booking.UserId = new Guid(GetCurrentUserId());
        await _bookingsService.CreateBookingAsync(booking, cancellationToken);
        
        return Ok();
    }
    
    [HttpPut("{id}")]
    [Authorize]
    public async Task<ActionResult> UpdateBookingAsync([FromRoute]Guid id, [FromBody] UpdateBookingRequest bookingRequest, CancellationToken cancellationToken = default)
    {
        var booking = _mapper.Map<Booking>(bookingRequest);
        booking.Id = id;
        booking.UserId = new Guid(GetCurrentUserId());
        await _bookingsService.UpdateBookingAsync(booking, cancellationToken);
        
        return Ok();
    }
    
    [HttpDelete("{id}")]
    [Authorize]
    public async Task<ActionResult> CancelBookingAsync([FromRoute]Guid id, CancellationToken cancellationToken = default)
    {
        await _bookingsService.DeleteBookingAsync(id, cancellationToken);
        
        return Ok();
    }

    [HttpGet("room/{roomId}")]
    public async Task<ActionResult<List<GetBookingResponse>>> GetBookingsForRoomAsync([FromRoute] Guid roomId,
        CancellationToken cancellationToken = default)
    {
        var bookings = await _bookingsService.GetBookingsForRoomAsync(roomId, cancellationToken);
        var response = _mapper.Map<List<GetBookingResponse>>(bookings);
        
        return Ok(response);
    }
    
    [HttpGet("user")]
    [Authorize]
    public async Task<ActionResult<List<GetBookingResponse>>> GetBookingsForUserAsync(
        CancellationToken cancellationToken = default)
    {
        var userId = GetCurrentUserId();
        var bookings = await _bookingsService.GetBookingsForUserAsync(new Guid(userId), cancellationToken);
        var rooms = await _roomService.GetRoomsByIdsAsync(bookings.Select(b => b.RoomId).ToArray(), cancellationToken);
        CorrelateRoomsAndBookings(rooms, bookings);
        var response = _mapper.Map<List<GetBookingResponse>>(bookings);
        
        return Ok(response);
    }

    private void CorrelateRoomsAndBookings(List<Room> rooms, List<Booking> bookings)
    {
        foreach (var booking in bookings)
        {
            booking.Room = rooms.First(r => r.Id == booking.RoomId);
        }
    }
    
    private string GetCurrentUserId()
    {
        var userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            throw new UnauthorizedAccessException();
        }

        return userId;
    }
}