using System.Security.Claims;
using AutoMapper;
using MeetSpace.Api.Contracts.Users;
using MeetSpace.Application.Abstractions.Services;
using MeetSpace.Domain.Abstractions.Services;
using MeetSpace.Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MeetSpace.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUsersService _usersService;
    private readonly IMapper _mapper;
    private readonly IFileStorageService _fileStorageService;

    public UsersController(IUsersService usersService, IMapper mapper, IFileStorageService fileStorageService)
    {
        _usersService = usersService;
        _mapper = mapper;
        _fileStorageService = fileStorageService;
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<GetUserResponse>> GetUserProfileAsync(CancellationToken cancellationToken = default)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var user = await _usersService.GetUserByIdAsync(new Guid(userId!), cancellationToken);
        var response = _mapper.Map<GetUserResponse>(user);
        
        return Ok(response);
    }
    
    [Authorize]
    [HttpPut("me")]
    public async Task<ActionResult> UpdateUserProfileAsync([FromBody]UpdateUserRequest request,
        CancellationToken cancellationToken = default)
    {
        var user = _mapper.Map<User>(request);
        user.Id = new Guid(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
        await _usersService.UpdateUserAsync(user, cancellationToken);
        
        return Ok();
    }
    
    [Authorize]
    [HttpGet("me/photo")]
    public async Task<ActionResult<GetProfileImageResponse>> GetUserProfileImageAsync([FromQuery]string imageKey, CancellationToken cancellationToken = default)
    {
        var fileUrl = await _fileStorageService.GetPresignedUrlAsync(imageKey, cancellationToken);
        
        return Ok(new GetProfileImageResponse { ProfileImageUrl = fileUrl });
    }
    
    [Authorize]
    [HttpPut("me/photo")]
    public async Task<ActionResult> UpdateUserProfileImageAsync([FromForm] UploadProfileImageRequest request,
        CancellationToken cancellationToken = default)
    {
        var stream = request.ProfileImage.OpenReadStream();
        var fileKey = await _fileStorageService.UploadFileAsync(stream, request.ProfileImage.FileName, request.ProfileImage.ContentType, cancellationToken);
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        await _usersService.UpdateUserImageAsync(new Guid(userId!), fileKey, cancellationToken);
        
        return Ok();
    }
}