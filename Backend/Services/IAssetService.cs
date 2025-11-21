using MoneyManager.API.DTOs;

namespace MoneyManager.API.Services;

public interface IAssetService
{
    Task<List<AssetDto>> GetAllAssetsAsync(int userId);
    Task<AssetDto> GetAssetByIdAsync(int userId, int assetId);
    Task<AssetDto> CreateAssetAsync(int userId, CreateAssetRequest request);
    Task<AssetDto> UpdateAssetAsync(int userId, int assetId, UpdateAssetRequest request);
    Task<bool> DeleteAssetAsync(int userId, int assetId);
}
