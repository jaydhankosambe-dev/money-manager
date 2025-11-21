using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MoneyManager.API.DTOs;
using MoneyManager.API.Services;
using System.Security.Claims;

namespace MoneyManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SettingsController : ControllerBase
{
    private readonly ISettingsService _settingsService;

    public SettingsController(ISettingsService settingsService)
    {
        _settingsService = settingsService;
    }

    [HttpGet]
    public async Task<ActionResult<UserSettingsDto>> GetSettings()
    {
        try
        {
            var userId = GetUserId();
            if (userId == 0)
            {
                return Unauthorized(new { message = "Invalid user token" });
            }
            var settings = await _settingsService.GetSettingsAsync(userId);
            return Ok(settings);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred", error = ex.Message });
        }
    }

    [HttpPut]
    public async Task<ActionResult<UserSettingsDto>> UpdateSettings([FromBody] UpdateSettingsRequest request)
    {
        try
        {
            var userId = GetUserId();
            if (userId == 0)
            {
                return Unauthorized(new { message = "Invalid user token" });
            }
            var settings = await _settingsService.UpdateSettingsAsync(userId, request);
            return Ok(settings);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred", error = ex.Message });
        }
    }

    private int GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.Parse(userIdClaim ?? "0");
    }
}

