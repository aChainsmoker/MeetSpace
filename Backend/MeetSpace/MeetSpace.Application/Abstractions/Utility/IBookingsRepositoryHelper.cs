using MeetSpace.Domain.Models;

namespace MeetSpace.Application.Abstractions.Utility;

public interface IBookingsRepositoryHelper
{
    Task<List<Booking>> GetBookingsForTheTimeSpanAndTheRoomAsync(Booking booking, CancellationToken cancellationToken = default);
}