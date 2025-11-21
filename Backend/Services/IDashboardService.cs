using MoneyManager.API.DTOs;

namespace MoneyManager.API.Services;

public interface IDashboardService
{
    Task<DashboardResponse> GetDashboardDataAsync(int userId);
}
