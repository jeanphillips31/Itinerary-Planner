namespace itinerary_planner.server.Models;

public class Itinerary
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public string? ImageUrl { get; set; }
    public DateTimeOffset StartDate { get; set; }
    public DateTimeOffset EndDate { get; set; }
    public bool Active { get; set; } = true;
    
    public required int UserId { get; set; }
    public User User { get; set; } = null!;
    
    public ICollection<Activity> Activities { get; } = new List<Activity>();
}