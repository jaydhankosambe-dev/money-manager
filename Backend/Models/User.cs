using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MoneyManager.API.Models;

public class User
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MinLength(4, ErrorMessage = "Username must be at least 4 characters")]
    [MaxLength(50)]
    public string Username { get; set; } = string.Empty;

    [Required]
    [MaxLength(256)]
    public string PasswordHash { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(100)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [Phone]
    [MaxLength(20)]
    public string PhoneNumber { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? ProfilePhotoUrl { get; set; }

    [MaxLength(200)]
    public string? GoogleId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? LastLoginAt { get; set; }

    // Navigation properties
    public virtual ICollection<Asset> Assets { get; set; } = new List<Asset>();
    public virtual UserSettings? UserSettings { get; set; }
    public virtual ICollection<MonthlyEntry> MonthlyEntries { get; set; } = new List<MonthlyEntry>();
}
