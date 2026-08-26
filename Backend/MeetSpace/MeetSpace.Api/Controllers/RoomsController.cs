using AutoMapper;
using MeetSpace.Api.Attributes;
using MeetSpace.Api.Contracts.Rooms;
using MeetSpace.Application.Abstractions.Services;
using MeetSpace.Domain.Abstractions.Services;
using Microsoft.AspNetCore.Mvc;

namespace MeetSpace.Api.Controllers;

[ApiController]
[Route("/api/[controller]")]
public class RoomsController : ControllerBase
{
    private readonly IRoomService _roomService;
    private readonly IMapper _mapper;
    private readonly IFileStorageService _fileStorageService;

    public RoomsController(IRoomService roomService, IMapper mapper, IFileStorageService fileStorageService)
    {
        _roomService = roomService;
        _mapper = mapper;
        _fileStorageService = fileStorageService;
    }

    [HttpGet]
    public async Task<ActionResult<List<GetRoomResponse>>> GetRoomsAsync(CancellationToken cancellationToken = default)
    {
        var rooms = await _roomService.GetAllRoomsAsync(cancellationToken);
        var response = _mapper.Map<List<GetRoomResponse>>(rooms);

        return Ok(response);
    }
    
    [HttpGet("{id}")]
    public async Task<ActionResult<GetRoomResponse>> GetRoomAsync([FromRoute] Guid id, CancellationToken cancellationToken = default)
    {
        var room = await _roomService.GetRoomByIdAsync(id, cancellationToken);
        var response = _mapper.Map<GetRoomResponse>(room);

        return Ok(response);
    }

    [OnlyManager]
    [HttpPost("{id}")]
    public async Task<ActionResult> UploadRoomImageAsync([FromRoute] Guid id, [FromForm] UploadRoomPhotoRequest request,
        CancellationToken cancellationToken = default)
    {
        var stream = request.Image.OpenReadStream();
        var fileKey = await _fileStorageService.UploadFileAsync(stream, request.Image.FileName, request.Image.ContentType, cancellationToken);
        await _roomService.UploadRoomImageAsync(id, fileKey, cancellationToken);
        
        return Ok();
    }
}