using Microsoft.EntityFrameworkCore;
using MoneyManager.API.Data;
using MoneyManager.API.DTOs;

namespace MoneyManager.API.Services;

public class DashboardService : IDashboardService
{
    private readonly ApplicationDbContext _context;

    public DashboardService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<DashboardResponse> GetDashboardDataAsync(int userId)
    {
        var assets = await _context.Assets
            .Where(e => e.UserId == userId && e.IsActive)
            .OrderBy(e => e.Name)
            .ToListAsync();

        var settings = await _context.UserSettings
            .FirstOrDefaultAsync(s => s.UserId == userId);

        if (settings == null)
        {
            settings = new Models.UserSettings
            {
                UserId = userId,
                DashboardViewType = "Grid",
                Theme = "Light",
                ShowAmount = true,
                ShowPercentage = true,
                ShowAssetName = true,
                ShowInvestmentType = true,
                DashboardColorScheme = "Default"
            };
            _context.UserSettings.Add(settings);
            await _context.SaveChangesAsync();
        }

        var totalAmount = assets.Sum(e => e.Amount);

        var assetDtos = assets.Select(e => new AssetDto
        {
            Id = e.Id,
            Name = e.Name.ToUpper(),
            Amount = e.Amount,
            TargetAmount = e.TargetAmount,
            InvestmentType = e.InvestmentType,
            RiskCategory = e.RiskCategory,
            Percentage = totalAmount > 0 ? Math.Round((e.Amount / totalAmount) * 100, 2) : 0
        }).ToList();

        return new DashboardResponse
        {
            TotalAmount = totalAmount,
 Assets = assetDtos,
            Settings = new UserSettingsDto
            {
                Id = settings.Id,
                DashboardViewType = settings.DashboardViewType,
                Theme = settings.Theme,
                ShowAmount = settings.ShowAmount,
                ShowPercentage = settings.ShowPercentage,
                ShowAssetName = settings.ShowAssetName,
                ShowInvestmentType = settings.ShowInvestmentType,
                DashboardColorScheme = settings.DashboardColorScheme
            }
        };
    }
}

