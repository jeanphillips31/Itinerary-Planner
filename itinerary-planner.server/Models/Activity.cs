namespace itinerary_planner.server.Models;

public class Activity
{
    public int Id { get; set; }
    public DateTimeOffset Date { get; set; }
    public required string Name { get; set; }
    public required string Location { get; set; }
    public float Latitude { get; set; }
    public float Longitude { get; set; }
    public DateTimeOffset StartTime { get; set; }
    public DateTimeOffset EndTime { get; set; }
    public bool Active { get; set; } = true;
    
    public required int ItineraryId { get; set; }
    public Itinerary Itinerary { get; set; } = null!;
}