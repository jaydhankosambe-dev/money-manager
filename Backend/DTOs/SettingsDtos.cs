namespace MoneyManager.API.DTOs;

public class UserSettingsDto
{
    public int Id { get; set; }
    public string DashboardViewType { get; set; } = "Grid";
    public string Theme { get; set; } = "Light";
    public bool ShowAmount { get; set; } = true;
    public bool ShowPercentage { get; set; } = true;
    public bool ShowAssetName { get; set; } = true;
    public bool ShowInvestmentType { get; set; } = true;
    public bool ShowDashboardAssets { get; set; } = false;
    public string DashboardColorScheme { get; set; } = "Default";
}

public class UpdateSettingsRequest
{
    public string? DashboardViewType { get; set; }
    public string? Theme { get; set; }
    public bool? ShowAmount { get; set; }
    public bool? ShowPercentage { get; set; }
    public bool? ShowAssetName { get; set; }
    public bool? ShowInvestmentType { get; set; }
    public bool? ShowDashboardAssets { get; set; }
    public string? DashboardColorScheme { get; set; }
}

