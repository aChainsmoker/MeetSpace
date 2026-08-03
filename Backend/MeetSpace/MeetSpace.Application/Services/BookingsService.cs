using MeetSpace.Application.Abstractions.Repositories;
using MeetSpace.Application.Abstractions.Utility;
using MeetSpace.Application.Exceptions;
using MeetSpace.Application.Settings;
using MeetSpace.Domain.Abstractions.Services;
using MeetSpace.Domain.Models;
using Microsoft.Extensions.Options;

namespace MeetSpace.Application.Services;

public class BookingsService : IBookingsService
{
    private readonly IBookingsRepository _bookingsRepository;
    private readonly IBookingsRepositoryHelper _bookingsRepositoryHelper;
    private readonly BookingSettings _bookingSettings;

    public BookingsService(IBookingsRepository bookingsRepository, IOptions<BookingSettings> bookingSettings, IBookingsRepositoryHelper bookingsRepositoryHelper)
    {
        _bookingsRepository = bookingsRepository;
        _bookingsRepositoryHelper = bookingsRepositoryHelper;
        _bookingSettings = bookingSettings.Value;
    }
    
    public async Task<List<Booking>> GetBookingsAsync(BookingsFilter filter, CancellationToken cancellationToken = default)
    {
        return await _bookingsRepository.GetBookingsAsync(filter, cancellationToken);
    }

    public async Task<List<Booking>> GetBookingsForRoomAsync(Guid roomId, CancellationToken cancellationToken = default)
    {
        return await _bookingsRepository.GetBookingsForRoomAsync(roomId, cancellationToken);
    }

    public async Task<List<Booking>> GetBookingsForUserAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _bookingsRepository.GetBookingsForUserAsync(userId, cancellationToken);
    }

    public async Task<Booking> GetBookingByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var booking = await _bookingsRepository.GetBookingByIdAsync(id, cancellationToken);
        if (booking == null)
        {
            throw new EntityNotFoundException("Booking was not found");
        }
        
        return booking;
    }

    public async Task CreateBookingAsync(Booking booking, CancellationToken cancellationToken = default)
    {
        CheckIfBookingIsInProperTimeInterval(booking);
        await CheckIfTimeSpanIsFree(booking);
        await _bookingsRepository.CreateBookingAsync(booking, cancellationToken);
    }

    public async Task UpdateBookingAsync(Booking booking, CancellationToken cancellationToken = default)
    {
        CheckIfBookingIsInProperTimeInterval(booking);    
        await CheckIfTimeSpanIsFree(booking);
        await _bookingsRepository.UpdateBookingAsync(booking, cancellationToken);
    }

    public async Task DeleteBookingAsync(Guid id, CancellationToken cancellationToken = default)
    {
        await _bookingsRepository.DeleteBookingAsync(id, cancellationToken);
    }

    private void CheckIfBookingIsInProperTimeInterval(Booking booking)
    {
        if (booking.StartOfBookingTime.TimeOfDay < _bookingSettings.WorkDayStart.ToTimeSpan() ||
            booking.EndOfBookingTime.TimeOfDay > _bookingSettings.WorkDayEnd.ToTimeSpan())
        {
            throw new InvalidDataException("Booking was not in the proper time interval");
        }
    }

    private async Task CheckIfTimeSpanIsFree(Booking booking)
    {
        var bookingsInTimeSpan = await _bookingsRepositoryHelper.GetBookingsForTheTimeSpanAndTheRoomAsync(booking);
        if (bookingsInTimeSpan.Count != 0)
        {
            throw new InvalidDataException("This room is already taken at this time");
        }
    }
}