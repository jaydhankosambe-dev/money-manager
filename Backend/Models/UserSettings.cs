using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MoneyManager.API.Models;

public class UserSettings
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int UserId { get; set; }

    [Required]
    [MaxLength(20)]
    public string DashboardViewType { get; set; } = "Grid"; // Grid, Tiles, Table

    [Required]
    [MaxLength(20)]
    public string Theme { get; set; } = "Light"; // Light, Dark

    public bool ShowAmount { get; set; } = true;

    public bool ShowPercentage { get; set; } = true;

    public bool ShowAssetName { get; set; } = true;

    public bool ShowInvestmentType { get; set; } = true;

    public bool ShowDashboardAssets { get; set; } = false;

    [MaxLength(20)]
    public string DashboardColorScheme { get; set; } = "Default";

    [MaxLength(20)]
    public string ButtonShape { get; set; } = "Rectangle"; // Rectangle, Circle

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    // Navigation property
    [ForeignKey("UserId")]
    public virtual User User { get; set; } = null!;
}

