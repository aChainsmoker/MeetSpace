using MeetSpace.Domain.Models;

namespace MeetSpace.Domain.Abstractions.Services;

public interface IBookingsService
{
    Task<List<Booking>> GetBookingsAsync(BookingsFilter filter, CancellationToken cancellationToken = default);
    Task<List<Booking>> GetBookingsForRoomAsync(Guid roomId, CancellationToken cancellationToken = default);
    Task<List<Booking>> GetBookingsForUserAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<Booking> GetBookingByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task CreateBookingAsync(Booking booking, CancellationToken cancellationToken = default);
    Task UpdateBookingAsync(Booking booking, CancellationToken cancellationToken = default);
    Task DeleteBookingAsync(Guid id, CancellationToken cancellationToken = default);
}