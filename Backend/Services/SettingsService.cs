using Microsoft.EntityFrameworkCore;
using MoneyManager.API.Data;
using MoneyManager.API.DTOs;
using MoneyManager.API.Models;

namespace MoneyManager.API.Services;

public class SettingsService : ISettingsService
{
    private readonly ApplicationDbContext _context;

    public SettingsService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<UserSettingsDto> GetSettingsAsync(int userId)
    {
        var settings = await _context.UserSettings
            .FirstOrDefaultAsync(s => s.UserId == userId);

        if (settings == null)
        {
            settings = new UserSettings
            {
                UserId = userId,
                DashboardViewType = "Grid",
                Theme = "Light",
                ShowAmount = true,
                ShowPercentage = true,
                ShowAssetName = true,
                ShowInvestmentType = true,
                ShowDashboardAssets = false,
                DashboardColorScheme = "Default",
                CreatedAt = DateTime.UtcNow
            };

            _context.UserSettings.Add(settings);
            await _context.SaveChangesAsync();
        }

        return new UserSettingsDto
        {
            Id = settings.Id,
            DashboardViewType = settings.DashboardViewType,
            Theme = settings.Theme,
            ShowAmount = settings.ShowAmount,
            ShowPercentage = settings.ShowPercentage,
            ShowAssetName = settings.ShowAssetName,
            ShowInvestmentType = settings.ShowInvestmentType,
            ShowDashboardAssets = settings.ShowDashboardAssets,
            DashboardColorScheme = settings.DashboardColorScheme,
        };
    }

    public async Task<UserSettingsDto> UpdateSettingsAsync(int userId, UpdateSettingsRequest request)
    {
        var settings = await _context.UserSettings
            .FirstOrDefaultAsync(s => s.UserId == userId);

        if (settings == null)
            throw new KeyNotFoundException("Settings not found");

        if (request.DashboardViewType != null)
            settings.DashboardViewType = request.DashboardViewType;

        if (request.Theme != null)
            settings.Theme = request.Theme;

        if (request.ShowAmount.HasValue)
            settings.ShowAmount = request.ShowAmount.Value;

        if (request.ShowPercentage.HasValue)
            settings.ShowPercentage = request.ShowPercentage.Value;

        if (request.ShowAssetName.HasValue)
            settings.ShowAssetName = request.ShowAssetName.Value;

        if (request.ShowInvestmentType.HasValue)
            settings.ShowInvestmentType = request.ShowInvestmentType.Value;

        if (request.ShowDashboardAssets.HasValue)
            settings.ShowDashboardAssets = request.ShowDashboardAssets.Value;

        if (request.DashboardColorScheme != null)
            settings.DashboardColorScheme = request.DashboardColorScheme;

        settings.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return new UserSettingsDto
        {
            Id = settings.Id,
            DashboardViewType = settings.DashboardViewType,
            Theme = settings.Theme,
            ShowAmount = settings.ShowAmount,
            ShowPercentage = settings.ShowPercentage,
            ShowAssetName = settings.ShowAssetName,
            ShowInvestmentType = settings.ShowInvestmentType,
            ShowDashboardAssets = settings.ShowDashboardAssets,
            DashboardColorScheme = settings.DashboardColorScheme
        };
    }
}

