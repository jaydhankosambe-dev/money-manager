namespace MoneyManager.API.DTOs;

public class MonthlyEntryDto
{
    public int Id { get; set; }
    public string MonthName { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public int Year { get; set; }
    public int Month { get; set; }
}

public class CreateMonthlyEntryRequest
{
    public string MonthName { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public int Year { get; set; }
    public int Month { get; set; }
}

public class UpdateMonthlyEntryRequest
{
    public string MonthName { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public int Year { get; set; }
    public int Month { get; set; }
}

public class ChartDataResponse
{
    public List<MonthlyEntryDto> MonthlyData { get; set; } = new();
    public List<PieChartData> InvestmentTypeDistribution { get; set; } = new();
    public List<PieChartData> AssetDistribution { get; set; } = new();
    public List<PieChartData> RiskDistribution { get; set; } = new();
}

public class PieChartData
{
    public string Name { get; set; } = string.Empty;
    public decimal Value { get; set; }
    public decimal Percentage { get; set; }
    public string Color { get; set; } = string.Empty;
}
