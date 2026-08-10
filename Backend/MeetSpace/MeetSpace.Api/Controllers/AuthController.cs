using AutoMapper;
using MeetSpace.Api.Contracts;
using MeetSpace.Api.Contracts.Users;
using MeetSpace.Application.Abstractions.Services;
using MeetSpace.Domain.Abstractions.Services;
using MeetSpace.Domain.Models;
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
    private readonly TokenIdentifiers _tokenIdentifiers;

    public AuthController(IUsersService usersService, IOptions<TokenIdentifiers> tokenIdentifiers, IOptions<RefreshTokenSettings> refreshTokenSettings, IMapper mapper)
    {
        _usersService = usersService;
        _mapper = mapper;
        _refreshTokenSettings = refreshTokenSettings.Value;
        _tokenIdentifiers = tokenIdentifiers.Value;
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
        AddTokenToCookie(_tokenIdentifiers.AccessTokenIdentifier, accessToken);
        if (loginRequest.RememberMe)
        {
            AddTokenToCookie(_tokenIdentifiers.RefreshTokenIdentifier, refreshToken);
        }

        return Ok();
    }
    
    [HttpPost("refresh")]
    public async Task<ActionResult> RefreshAccessTokenAsync([FromServices] IRefreshTokensService refreshTokensService , CancellationToken cancellationToken = default)
    {
        var refreshToken = Request.Cookies[_tokenIdentifiers.RefreshTokenIdentifier] ??
                           throw new UnauthorizedAccessException("Refresh token was not found");
        var accessToken = await _usersService.LoginUserAsync(refreshToken, cancellationToken);
        AddTokenToCookie(_tokenIdentifiers.AccessTokenIdentifier, accessToken);

        return Ok();
    }

    [HttpDelete("logout")]
    public ActionResult LogoffAsync()
    {
        RemoveTokenFromCookie(_tokenIdentifiers.AccessTokenIdentifier);
        RemoveTokenFromCookie(_tokenIdentifiers.RefreshTokenIdentifier);
        
        return Ok();
    }
    
    private void AddTokenToCookie(string tokenName, string token)
    {
        HttpContext.Response.Cookies.Append(tokenName, token, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = tokenName == _tokenIdentifiers.RefreshTokenIdentifier
                ? DateTime.UtcNow.AddDays(_refreshTokenSettings.ExpiresInDays)
                : null
        });
    }

    private void RemoveTokenFromCookie(string tokenName)
    {
        HttpContext.Response.Cookies.Delete(tokenName, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
        });
    }
}