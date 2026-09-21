namespace MeetSpace.Application.Exceptions;

public class DuplicateEmailException(string message) : EntityCreatingException(message);