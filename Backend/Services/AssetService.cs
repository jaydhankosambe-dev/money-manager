using Microsoft.EntityFrameworkCore;
using MoneyManager.API.Data;
using MoneyManager.API.DTOs;
using MoneyManager.API.Models;

namespace MoneyManager.API.Services;

public class AssetService : IAssetService
{
    private readonly ApplicationDbContext _context;

    public AssetService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<AssetDto>> GetAllAssetsAsync(int userId)
    {
        var assets = await _context.Assets
            .Where(e => e.UserId == userId && e.IsActive)
            .OrderBy(e => e.Name)
            .ToListAsync();

        var totalAmount = assets.Sum(e => e.Amount);

        return assets.Select(e => new AssetDto
        {
            Id = e.Id,
            Name = e.Name.ToUpper(),
            Amount = e.Amount,
            TargetAmount = e.TargetAmount,
            InvestmentType = e.InvestmentType,
            RiskCategory = e.RiskCategory,
            Percentage = totalAmount > 0 ? Math.Round((e.Amount / totalAmount) * 100, 2) : 0
        }).ToList();
    }

    public async Task<AssetDto> GetAssetByIdAsync(int userId, int assetId)
    {
        var asset = await _context.Assets
            .FirstOrDefaultAsync(e => e.Id == assetId && e.UserId == userId && e.IsActive);

        if (asset == null)
            throw new KeyNotFoundException("Asset not found");

        var totalAmount = await _context.Assets
            .Where(e => e.UserId == userId && e.IsActive)
            .SumAsync(e => e.Amount);

        return new AssetDto
        {
            Id = asset.Id,
            Name = asset.Name.ToUpper(),
            Amount = asset.Amount,
            TargetAmount = asset.TargetAmount,
            InvestmentType = asset.InvestmentType,
            RiskCategory = asset.RiskCategory,
            Percentage = totalAmount > 0 ? Math.Round((asset.Amount / totalAmount) * 100, 2) : 0
        };
    }

    public async Task<AssetDto> CreateAssetAsync(int userId, CreateAssetRequest request)
    {
        var asset = new Asset
        {
            UserId = userId,
            Name = request.Name,
            Amount = request.Amount,
            TargetAmount = request.TargetAmount,
            InvestmentType = request.InvestmentType,
            RiskCategory = request.RiskCategory,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        _context.Assets.Add(asset);
        await _context.SaveChangesAsync();

        var totalAmount = await _context.Assets
            .Where(e => e.UserId == userId && e.IsActive)
            .SumAsync(e => e.Amount);

        return new AssetDto
        {
            Id = asset.Id,
            Name = asset.Name.ToUpper(),
            Amount = asset.Amount,
            TargetAmount = asset.TargetAmount,
            InvestmentType = asset.InvestmentType,
            RiskCategory = asset.RiskCategory,
            Percentage = totalAmount > 0 ? Math.Round((asset.Amount / totalAmount) * 100, 2) : 0
        };
    }

    public async Task<AssetDto> UpdateAssetAsync(int userId, int assetId, UpdateAssetRequest request)
    {
        var asset = await _context.Assets
            .FirstOrDefaultAsync(e => e.Id == assetId && e.UserId == userId && e.IsActive);

        if (asset == null)
            throw new KeyNotFoundException("Asset not found");

        asset.Name = request.Name;
        asset.Amount = request.Amount;
        asset.TargetAmount = request.TargetAmount;
        asset.InvestmentType = request.InvestmentType;
        asset.RiskCategory = request.RiskCategory;
        asset.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        var totalAmount = await _context.Assets
            .Where(e => e.UserId == userId && e.IsActive)
            .SumAsync(e => e.Amount);

        return new AssetDto
        {
            Id = asset.Id,
            Name = asset.Name.ToUpper(),
            Amount = asset.Amount,
            TargetAmount = asset.TargetAmount,
            InvestmentType = asset.InvestmentType,
            RiskCategory = asset.RiskCategory,
            Percentage = totalAmount > 0 ? Math.Round((asset.Amount / totalAmount) * 100, 2) : 0
        };
    }

    public async Task<bool> DeleteAssetAsync(int userId, int assetId)
    {
        var asset = await _context.Assets
            .FirstOrDefaultAsync(e => e.Id == assetId && e.UserId == userId && e.IsActive);

        if (asset == null)
            return false;

        // Soft delete - set IsActive to false
        asset.IsActive = false;
        asset.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return true;
    }
}



