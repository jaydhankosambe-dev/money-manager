namespace MoneyManager.API.DTOs;

public class DashboardResponse
{
    public decimal TotalAmount { get; set; }
    public List<AssetDto> Assets { get; set; } = new();
    public UserSettingsDto Settings { get; set; } = null!;
}

public class AssetBreakdown
{
    public string Name { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public decimal Percentage { get; set; }
    public string InvestmentType { get; set; } = string.Empty;
    public string RiskCategory { get; set; } = string.Empty;
}

