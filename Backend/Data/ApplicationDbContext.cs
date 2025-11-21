using Microsoft.EntityFrameworkCore;
using MoneyManager.API.Models;

namespace MoneyManager.API.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Asset> Assets { get; set; }
    public DbSet<MonthlyEntry> MonthlyEntries { get; set; }
    public DbSet<UserSettings> UserSettings { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User configuration
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<User>()
            .HasIndex(u => u.GoogleId)
            .IsUnique();

        // Asset configuration
        modelBuilder.Entity<Asset>()
            .HasOne(e => e.User)
            .WithMany(u => u.Assets)
            .HasForeignKey(e => e.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // MonthlyEntry configuration
        modelBuilder.Entity<MonthlyEntry>()
            .HasOne(m => m.User)
            .WithMany(u => u.MonthlyEntries)
            .HasForeignKey(m => m.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // UserSettings configuration
        modelBuilder.Entity<UserSettings>()
            .HasOne(s => s.User)
            .WithOne(u => u.UserSettings)
            .HasForeignKey<UserSettings>(s => s.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}




