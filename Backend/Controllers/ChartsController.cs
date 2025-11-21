using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MoneyManager.API.DTOs;
using MoneyManager.API.Services;
using System.Security.Claims;

namespace MoneyManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ChartsController : ControllerBase
{
    private readonly IChartService _chartService;

    public ChartsController(IChartService chartService)
    {
        _chartService = chartService;
    }

    [HttpGet]
    public async Task<ActionResult<ChartDataResponse>> GetChartData()
    {
        try
        {
            var userId = GetUserId();
            if (userId == 0)
            {
                return Unauthorized(new { message = "Invalid user token" });
            }
            var data = await _chartService.GetChartDataAsync(userId);
            return Ok(data);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred", error = ex.Message });
        }
    }

    [HttpGet("monthly")]
    public async Task<ActionResult<List<MonthlyEntryDto>>> GetMonthlyEntries()
    {
        try
        {
            var userId = GetUserId();
            if (userId == 0)
            {
                return Unauthorized(new { message = "Invalid user token" });
            }
            var entries = await _chartService.GetMonthlyEntriesAsync(userId);
            return Ok(entries);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred", error = ex.Message });
        }
    }

    [HttpPost("monthly")]
    public async Task<ActionResult<MonthlyEntryDto>> CreateMonthlyEntry([FromBody] CreateMonthlyEntryRequest request)
    {
        try
        {
            var userId = GetUserId();
            if (userId == 0)
            {
                return Unauthorized(new { message = "Invalid user token" });
            }
            var entry = await _chartService.CreateMonthlyEntryAsync(userId, request);
            return CreatedAtAction(nameof(GetMonthlyEntries), entry);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred", error = ex.Message });
        }
    }

    [HttpPut("monthly/{id}")]
    public async Task<ActionResult<MonthlyEntryDto>> UpdateMonthlyEntry(int id, [FromBody] UpdateMonthlyEntryRequest request)
    {
        try
        {
            var userId = GetUserId();
            if (userId == 0)
            {
                return Unauthorized(new { message = "Invalid user token" });
            }
            var entry = await _chartService.UpdateMonthlyEntryAsync(userId, id, request);
            return Ok(entry);
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

    [HttpDelete("monthly/{id}")]
    public async Task<IActionResult> DeleteMonthlyEntry(int id)
    {
        try
        {
            var userId = GetUserId();
            if (userId == 0)
            {
                return Unauthorized(new { message = "Invalid user token" });
            }
            var result = await _chartService.DeleteMonthlyEntryAsync(userId, id);
            
            if (!result)
                return NotFound(new { message = "Monthly entry not found" });

            return NoContent();
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
