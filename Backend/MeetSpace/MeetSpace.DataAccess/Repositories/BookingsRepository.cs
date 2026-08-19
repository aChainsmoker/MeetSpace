using MeetSpace.Application.Abstractions.Repositories;
using MeetSpace.Application.Abstractions.Utility;
using MeetSpace.DataAccess.Context;
using MeetSpace.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace MeetSpace.DataAccess.Repositories;

public class BookingsRepository : IBookingsRepository, IBookingsRepositoryHelper
{
    private readonly MeetSpaceDbContext _dbContext;

    public BookingsRepository(MeetSpaceDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<Booking>> GetBookingsAsync(BookingsFilter filter,
        CancellationToken cancellationToken = default)
    {
        var bookings = _dbContext.Bookings.AsNoTracking();
        bookings = FilterBookings(filter, bookings);

        return await bookings.ToListAsync(cancellationToken);
    }

    public async Task<List<Booking>> GetBookingsForRoomAsync(Guid roomId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Bookings
            .AsNoTracking()
            .Where(x => x.RoomId == roomId)
            .ToListAsync(cancellationToken);
    }

    public async Task<List<Booking>> GetBookingsForUserAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Bookings
            .AsNoTracking()
            .Where(x => x.UserId == userId)
            .ToListAsync(cancellationToken);
    }

    public async Task<Booking?> GetBookingByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Bookings
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task CreateBookingAsync(Booking booking, CancellationToken cancellationToken = default)
    {
        await _dbContext.Bookings.AddAsync(booking, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateBookingAsync(Booking booking, CancellationToken cancellationToken = default)
    {
        _dbContext.Bookings.Update(booking);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteBookingAsync(Guid id, CancellationToken cancellationToken = default)
    {
        await _dbContext.Bookings
            .Where(x => x.Id == id)
            .ExecuteDeleteAsync(cancellationToken);
    }

    public async Task<List<Booking>> GetBookingsForTheTimeSpanAndTheRoomAsync(Booking booking,
        CancellationToken cancellationToken = default)
    {
        var bookings = _dbContext.Bookings.AsNoTracking();
        bookings = FilterBookings(new BookingsFilter
        {
            StartDate = booking.BookingDate,
            EndDate = booking.BookingDate,
            StartTime = booking.StartOfBookingTime,
            EndTime = booking.EndOfBookingTime,
        }, bookings);
        bookings = bookings.Where(x => x.RoomId == booking.RoomId);

        return await bookings.ToListAsync(cancellationToken);
    }

    private static IQueryable<Booking> FilterBookings(BookingsFilter filter, IQueryable<Booking> bookings)
    {
        if (filter.StartDate != null && filter.EndDate != null)
        {
            bookings = bookings.Where(x =>
                x.BookingDate >= filter.StartDate &&
                x.BookingDate <= filter.EndDate);
        }

        if (filter.StartTime != null && filter.EndTime != null)
        {
            bookings = bookings.Where(x =>
                (x.StartOfBookingTime >= ((TimeOnly)filter.StartTime) &&
                 x.StartOfBookingTime <= ((TimeOnly)filter.EndTime)) ||
                (x.EndOfBookingTime >= ((TimeOnly)filter.StartTime) &&
                 x.EndOfBookingTime <= ((TimeOnly)filter.EndTime)) ||
                (x.StartOfBookingTime <= ((TimeOnly)filter.StartTime) &&
                 x.EndOfBookingTime >= ((TimeOnly)filter.EndTime)));
        }

        if (filter.Capacity != null)
        {
            bookings = bookings
                .Where(x => x.Room.Capacity >= filter.Capacity)
                .Include(x => x.Room);
        }

        if (!string.IsNullOrEmpty(filter.RoomSearchQuery))
        {
            bookings = bookings
                .Where(x => x.Room.Name.Contains(filter.RoomSearchQuery))
                .Include(x => x.Room);
        }

        if (filter.RoomEquipmentsIds.Any())
        {
            bookings = bookings
                .Where(x => filter.RoomEquipmentsIds
                    .All(re => x.Room.RoomEquipments
                        .Select(i => i.Id)
                        .Contains(re)));
        }

        return bookings;
    }
}