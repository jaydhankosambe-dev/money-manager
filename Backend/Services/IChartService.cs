using MoneyManager.API.DTOs;

namespace MoneyManager.API.Services;

public interface IChartService
{
    Task<ChartDataResponse> GetChartDataAsync(int userId);
    Task<List<MonthlyEntryDto>> GetMonthlyEntriesAsync(int userId);
    Task<MonthlyEntryDto> CreateMonthlyEntryAsync(int userId, CreateMonthlyEntryRequest request);
    Task<MonthlyEntryDto> UpdateMonthlyEntryAsync(int userId, int entryId, UpdateMonthlyEntryRequest request);
    Task<bool> DeleteMonthlyEntryAsync(int userId, int entryId);
}
