namespace MoneyManager.API.DTOs;

public class AssetDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public decimal? TargetAmount { get; set; }
    public string InvestmentType { get; set; } = string.Empty;
    public string RiskCategory { get; set; } = string.Empty;
    public decimal Percentage { get; set; }
}

public class CreateAssetRequest
{
    public string Name { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public decimal? TargetAmount { get; set; }
    public string InvestmentType { get; set; } = "Liquid";
    public string RiskCategory { get; set; } = "Low";
}

public class UpdateAssetRequest
{
    public string Name { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public decimal? TargetAmount { get; set; }
    public string InvestmentType { get; set; } = string.Empty;
    public string RiskCategory { get; set; } = string.Empty;
}

