using Microsoft.EntityFrameworkCore;

namespace itinerary_planner.server.Models;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
{
    public DbSet<Itinerary> Itineraries { get; set; }
    public DbSet<Activity> Activities { get; set; }
    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Itinerary>()
            .HasMany(e => e.Activities)
            .WithOne(i => i.Itinerary)
            .HasForeignKey(a => a.ItineraryId)
            .IsRequired(false);
        
        modelBuilder.Entity<User>()
            .HasMany(u => u.Itineraries)
            .WithOne(i => i.User)
            .HasForeignKey(u => u.UserId)
            .IsRequired(false);
    }
}
