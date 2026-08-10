using AutoMapper;
using MeetSpace.Api.Contracts;
using MeetSpace.Api.Contracts.Auth;
using MeetSpace.Api.Contracts.Users;
using MeetSpace.Application.Abstractions.Services;
using MeetSpace.Domain.Abstractions.Services;
using MeetSpace.Domain.Models;
using MeetSpace.Domain.Models.Tokens;
using MeetSpace.Infrastructure.Auth.Tokens.Settings;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace MeetSpace.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUsersService _usersService;
    private readonly IMapper _mapper;
    private readonly RefreshTokenSettings _refreshTokenSettings;

    public AuthController(IUsersService usersService, IOptions<RefreshTokenSettings> refreshTokenSettings, IMapper mapper)
    {
        _usersService = usersService;
        _mapper = mapper;
        _refreshTokenSettings = refreshTokenSettings.Value;
    }

    [HttpPost("register")]
    public async Task<ActionResult> RegisterAsync([FromBody]AuthRegisterRequest registerRequest, CancellationToken cancellationToken = default)
    {
        await _usersService.RegisterUserAsync(registerRequest.FirstName, registerRequest.LastName, registerRequest.Email, registerRequest.Password, cancellationToken);

        return Ok();
    }
    
    [HttpPost("login")]
    public async Task<ActionResult> LoginAsync([FromBody]AuthLoginRequest loginRequest, CancellationToken cancellationToken = default)
    {
        var (accessToken, refreshToken) =
            await _usersService.LoginUserAsync(loginRequest.Email, loginRequest.Password, cancellationToken);

        return Ok(new AuthResponse { AccessToken = accessToken, RefreshToken = refreshToken });
    }
    
    [HttpPost("refresh")]
    public async Task<ActionResult> RefreshAccessTokenAsync([FromBody] RefreshTokenRequest request, CancellationToken cancellationToken = default)
    {
        var accessToken = await _usersService.LoginUserAsync(request.RefreshToken, cancellationToken);

        return Ok(new AuthResponse { AccessToken = accessToken, RefreshToken = request.RefreshToken });
    }
}