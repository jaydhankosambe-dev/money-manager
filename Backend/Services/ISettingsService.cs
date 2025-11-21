using MoneyManager.API.DTOs;

namespace MoneyManager.API.Services;

public interface ISettingsService
{
    Task<UserSettingsDto> GetSettingsAsync(int userId);
    Task<UserSettingsDto> UpdateSettingsAsync(int userId, UpdateSettingsRequest request);
}
