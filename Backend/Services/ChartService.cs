using Microsoft.EntityFrameworkCore;
using MoneyManager.API.Data;
using MoneyManager.API.DTOs;
using MoneyManager.API.Models;

namespace MoneyManager.API.Services;

public class ChartService : IChartService
{
    private readonly ApplicationDbContext _context;
    private static readonly Dictionary<string, string> ColorPalette = new()
    {
        { "STOCKS", "#FF6384" },
        { "MUTUAL FUND", "#36A2EB" },
        { "FD", "#FFCE56" },
        { "SAVING", "#4BC0C0" },
        { "EPF", "#9966FF" },
        { "PF", "#FF9F40" },
        { "Low", "#4CAF50" },
        { "Moderate", "#FFC107" },
        { "High", "#F44336" }
    };

    public ChartService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ChartDataResponse> GetChartDataAsync(int userId)
    {
        var monthlyEntries = await _context.MonthlyEntries
            .Where(m => m.UserId == userId && m.IsActive)
            .OrderBy(m => m.Year)
            .ThenBy(m => m.Month)
            .ToListAsync();

        var entities = await _context.Assets
            .Where(e => e.UserId == userId && e.IsActive)
            .ToListAsync();

        var totalAmount = entities.Sum(e => e.Amount);

        // Investment Type Distribution
        var investmentTypeDistribution = entities
            .GroupBy(e => e.InvestmentType)
            .Select(g => new PieChartData
            {
                Name = g.Key,
                Value = g.Sum(e => e.Amount),
                Percentage = totalAmount > 0 ? Math.Round((g.Sum(e => e.Amount) / totalAmount) * 100, 2) : 0,
                Color = GetColorForInvestmentType(g.Key)
            })
            .ToList();

        // Asset Distribution
        var assetDistribution = entities
            .GroupBy(e => e.Name.ToUpper())
            .Select((g, index) => new PieChartData
            {
                Name = g.Key,
                Value = g.Sum(e => e.Amount),
                Percentage = totalAmount > 0 ? Math.Round((g.Sum(e => e.Amount) / totalAmount) * 100, 2) : 0,
                Color = GetColorForAsset(g.Key, index)
            })
            .ToList();

        // Risk Distribution
        var riskDistribution = entities
            .GroupBy(e => e.RiskCategory)
            .Select(g => new PieChartData
            {
                Name = g.Key,
                Value = g.Sum(e => e.Amount),
                Percentage = totalAmount > 0 ? Math.Round((g.Sum(e => e.Amount) / totalAmount) * 100, 2) : 0,
                Color = GetColorForRisk(g.Key)
            })
            .ToList();

        return new ChartDataResponse
        {
            MonthlyData = monthlyEntries.Select(m => new MonthlyEntryDto
            {
                Id = m.Id,
                MonthName = m.MonthName,
                Amount = m.Amount,
                Year = m.Year,
                Month = m.Month
            }).ToList(),
            InvestmentTypeDistribution = investmentTypeDistribution,
            AssetDistribution = assetDistribution,
            RiskDistribution = riskDistribution
        };
    }

    public async Task<List<MonthlyEntryDto>> GetMonthlyEntriesAsync(int userId)
    {
        var entries = await _context.MonthlyEntries
            .Where(m => m.UserId == userId && m.IsActive)
            .OrderBy(m => m.Year)
            .ThenBy(m => m.Month)
            .ToListAsync();

        return entries.Select(m => new MonthlyEntryDto
        {
            Id = m.Id,
            MonthName = m.MonthName,
            Amount = m.Amount,
            Year = m.Year,
            Month = m.Month
        }).ToList();
    }

    public async Task<MonthlyEntryDto> CreateMonthlyEntryAsync(int userId, CreateMonthlyEntryRequest request)
    {
        var entry = new MonthlyEntry
        {
            UserId = userId,
            MonthName = request.MonthName,
            Amount = request.Amount,
            Year = request.Year,
            Month = request.Month,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        _context.MonthlyEntries.Add(entry);
        await _context.SaveChangesAsync();

        return new MonthlyEntryDto
        {
            Id = entry.Id,
            MonthName = entry.MonthName,
            Amount = entry.Amount,
            Year = entry.Year,
            Month = entry.Month
        };
    }

    public async Task<MonthlyEntryDto> UpdateMonthlyEntryAsync(int userId, int entryId, UpdateMonthlyEntryRequest request)     
    {
        var entry = await _context.MonthlyEntries
            .FirstOrDefaultAsync(m => m.Id == entryId && m.UserId == userId && m.IsActive);

        if (entry == null)
            throw new KeyNotFoundException("Monthly entry not found");

        entry.MonthName = request.MonthName;
        entry.Amount = request.Amount;
        entry.Year = request.Year;
        entry.Month = request.Month;
        entry.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return new MonthlyEntryDto
        {
            Id = entry.Id,
            MonthName = entry.MonthName,
            Amount = entry.Amount,
            Year = entry.Year,
            Month = entry.Month
        };
    }

    public async Task<bool> DeleteMonthlyEntryAsync(int userId, int entryId)
    {
        var entry = await _context.MonthlyEntries
            .FirstOrDefaultAsync(m => m.Id == entryId && m.UserId == userId && m.IsActive);

        if (entry == null)
            return false;

        // Soft delete - set IsActive to false
        entry.IsActive = false;
        entry.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return true;
    }

    private static string GetColorForAsset(string assetName, int index)
    {
        if (ColorPalette.TryGetValue(assetName, out var color))
            return color;

        var colors = new[] { "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#FF6B6B", "#4ECDC4" };
        return colors[index % colors.Length];
    }

    private static string GetColorForRisk(string riskCategory)
    {
        return ColorPalette.TryGetValue(riskCategory, out var color) ? color : "#999999";
    }

    private static string GetColorForInvestmentType(string investmentType)
    {
        return investmentType switch
        {
            "Invested" => "#4CAF50", // Green
            "Liquid" => "#2196F3",   // Blue
            _ => "#999999"
        };
    }
}

