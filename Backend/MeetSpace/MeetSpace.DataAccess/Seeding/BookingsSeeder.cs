using MeetSpace.Application.Abstractions.Auth;
using MeetSpace.Application.Settings;
using MeetSpace.DataAccess.Context;
using MeetSpace.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace MeetSpace.DataAccess.Seeding;

public class BookingsSeeder
{
    private const int BookingsPerRoom = 2;
    private const int DaysOfBookings = 14;
    private const int MinBookingDurationMinutes = 30;
    private const int MaxBookingDurationMinutes = 90;
    private static readonly TimeSpan DurationStep = TimeSpan.FromMinutes(15);

    private static readonly Guid UserRoleId = new("06af8b49-9a2a-4017-af1d-c2d0ef25ec45");

    private readonly MeetSpaceDbContext _dbContext;
    private readonly BookingSettings _bookingSettings;
    private readonly IPasswordHasher _passwordHasher;

    public BookingsSeeder(
        MeetSpaceDbContext dbContext,
        IOptions<BookingSettings> bookingSettings,
        IPasswordHasher passwordHasher)
    {
        _dbContext = dbContext;
        _bookingSettings = bookingSettings.Value;
        _passwordHasher = passwordHasher;
    }

    public async Task SeedAsync(CancellationToken cancellationToken = default)
    {
        if (await _dbContext.Bookings.AnyAsync(cancellationToken))
        {
            return;
        }

        var rooms = await _dbContext.Rooms
            .AsNoTracking()
            .ToListAsync(cancellationToken);
        if (rooms.Count == 0)
        {
            return;
        }

        var users = await _dbContext.Users
            .AsNoTracking()
            .ToListAsync(cancellationToken);
        var demoUsers = await EnsureDemoUsersAsync(users, cancellationToken);
        users.AddRange(demoUsers);

        if (users.Count == 0)
        {
            return;
        }

        var random = new Random();
        var workDayStart = _bookingSettings.WorkDayStart;
        var workDayEnd = _bookingSettings.WorkDayEnd;

        var bookings = new List<Booking>();
        var counter = 1;

        for (var j = 0; j < DaysOfBookings; j++)
        {
            foreach (var room in rooms)
            {
                for (var i = 0; i < BookingsPerRoom; i++)
                {
                    var (start, end) = GenerateNonOverlappingSlot(random, workDayStart, workDayEnd,
                        bookings.Where(b => b.RoomId == room.Id && b.BookingDate == DateOnly.FromDateTime(DateTime.UtcNow.AddDays(j))));
                    var user = users[random.Next(users.Count)];

                    bookings.Add(new Booking
                    {
                        Id = Guid.NewGuid(),
                        Title = $"Бронирование {counter}",
                        Description = $"Описание бронирования {counter}",
                        UserId = user.Id,
                        RoomId = room.Id,
                        StartOfBookingTime = start,
                        EndOfBookingTime = end,
                        BookingDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(j)),
                    });

                    counter++;
                }
            }
        }

        await _dbContext.Bookings.AddRangeAsync(bookings, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    private (TimeOnly Start, TimeOnly End) GenerateNonOverlappingSlot(
        Random random,
        TimeOnly workDayStart,
        TimeOnly workDayEnd,
        IEnumerable<Booking> existingBookings)
    {
        var existing = existingBookings
            .Select(b => (Start: b.StartOfBookingTime, End: b.EndOfBookingTime))
            .OrderBy(s => s.Start)
            .ToList();

        var slots = new List<(TimeOnly Start, TimeOnly End)>();
        var cursor = workDayStart;

        foreach (var booking in existing)
        {
            if (booking.Start > cursor)
            {
                slots.Add((cursor, booking.Start));
            }

            if (booking.End > cursor)
            {
                cursor = booking.End;
            }
        }

        if (workDayEnd > cursor)
        {
            slots.Add((cursor, workDayEnd));
        }

        var validSlots = slots
            .Where(s => s.End - s.Start >= TimeSpan.FromMinutes(MinBookingDurationMinutes))
            .ToList();
        var slot = validSlots[random.Next(validSlots.Count)];

        var durationMinutes = GetRandomDurationMinutes(random, slot);
        var latestStart = slot.End.AddMinutes(-durationMinutes);
        var start = RandomTime(random, slot.Start, latestStart);

        return (start, start.AddMinutes(durationMinutes));
    }

    private static int GetRandomDurationMinutes(Random random, (TimeOnly Start, TimeOnly End) slot)
    {
        var slotMinutes = (int)(slot.End - slot.Start).TotalMinutes;
        var maxDuration = Math.Min(MaxBookingDurationMinutes, slotMinutes);
        var stepCount = (maxDuration - MinBookingDurationMinutes) / (int)DurationStep.TotalMinutes;
        var steps = random.Next(0, stepCount + 1);
        
        return MinBookingDurationMinutes + steps * (int)DurationStep.TotalMinutes;
    }

    private static TimeOnly RandomTime(Random random, TimeOnly start, TimeOnly end)
    {
        var totalMinutes = (int)(end - start).TotalMinutes;
        var offset = random.Next(0, totalMinutes + 1);
        
        return start.AddMinutes(offset);
    }

    private async Task<List<User>> EnsureDemoUsersAsync(List<User> existingUsers, CancellationToken cancellationToken)
    {
        var demoUsers = new List<User>
        {
            new()
            {
                Id = Guid.NewGuid(),
                FirstName = "Иван",
                LastName = "Иванов",
                Email = "ivan@example.com",
                PasswordHash = _passwordHasher.HashPassword("user123"),
                RoleId = UserRoleId
            },
            new()
            {
                Id = Guid.NewGuid(),
                FirstName = "Мария",
                LastName = "Смирнова",
                Email = "maria@example.com",
                PasswordHash = _passwordHasher.HashPassword("user123"),
                RoleId = UserRoleId
            },
            new()
            {
                Id = Guid.NewGuid(),
                FirstName = "Пётр",
                LastName = "Петров",
                Email = "petr@example.com",
                PasswordHash = _passwordHasher.HashPassword("user123"),
                RoleId = UserRoleId
            }
        };

        var existingEmails = existingUsers
            .Select(u => u.Email)
            .ToHashSet();
        var usersToAdd = demoUsers
            .Where(u => !existingEmails
                .Contains(u.Email))
            .ToList();

        if (usersToAdd.Count > 0)
        {
            await _dbContext.Users.AddRangeAsync(usersToAdd, cancellationToken);
            await _dbContext.SaveChangesAsync(cancellationToken);
        }

        return usersToAdd;
    }
}
