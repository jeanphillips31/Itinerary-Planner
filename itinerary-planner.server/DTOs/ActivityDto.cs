namespace itinerary_planner.server.DTOs;

public class ActivityDto
{
    public int Id { get; set; }
    public DateTimeOffset Date { get; set; }
    public required string Name { get; set; }
    public required string Location { get; set; }
    public float Latitude { get; set; }
    public float Longitude { get; set; }
    public DateTimeOffset StartTime { get; set; }
    public DateTimeOffset EndTime { get; set; }
}