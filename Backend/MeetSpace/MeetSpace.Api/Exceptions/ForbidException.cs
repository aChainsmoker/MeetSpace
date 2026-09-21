namespace MeetSpace.Api.Exceptions;

public class ForbidException(string message): UnauthorizedAccessException(message);