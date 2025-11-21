using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MoneyManager.API.DTOs;
using MoneyManager.API.Services;
using System.Security.Claims;

namespace MoneyManager.API.Controllers;

[ApiController]
[Route("api/assets")]
[Authorize]
public class AssetsController : ControllerBase
{
    private readonly IAssetService _assetService;

    public AssetsController(IAssetService assetService)
    {
        _assetService = assetService;
    }

    [HttpGet]
    public async Task<ActionResult<List<AssetDto>>> GetAll()
    {
        try
        {
            var userId = GetUserId();
            if (userId == 0)
            {
                return Unauthorized(new { message = "Invalid user token" });
            }
            var assets = await _assetService.GetAllAssetsAsync(userId);
            return Ok(assets);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred", error = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<AssetDto>> GetById(int id)
    {
        try
        {
            var userId = GetUserId();
            if (userId == 0)
            {
                return Unauthorized(new { message = "Invalid user token" });
            }
            var asset = await _assetService.GetAssetByIdAsync(userId, id);
            return Ok(asset);
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

    [HttpPost]
    public async Task<ActionResult<AssetDto>> Create([FromBody] CreateAssetRequest request)
    {
        try
        {
            var userId = GetUserId();
            if (userId == 0)
            {
                return Unauthorized(new { message = "Invalid user token" });
            }
            var asset = await _assetService.CreateAssetAsync(userId, request);
            return CreatedAtAction(nameof(GetById), new { id = asset.Id }, asset);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred", error = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<AssetDto>> Update(int id, [FromBody] UpdateAssetRequest request)
    {
        try
        {
            var userId = GetUserId();
            if (userId == 0)
            {
                return Unauthorized(new { message = "Invalid user token" });
            }
            var asset = await _assetService.UpdateAssetAsync(userId, id, request);
            return Ok(asset);
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

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var userId = GetUserId();
            if (userId == 0)
            {
                return Unauthorized(new { message = "Invalid user token" });
            }
            var result = await _assetService.DeleteAssetAsync(userId, id);
            
            if (!result)
                return NotFound(new { message = "Asset not found" });

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

