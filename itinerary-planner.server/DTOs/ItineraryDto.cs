namespace itinerary_planner.server.DTOs;

public class ItineraryDto
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public IFormFile? Image { get; set; }
    public string? ImageUrl { get; set; }
    public DateTimeOffset StartDate { get; set; }
    public DateTimeOffset EndDate { get; set; }
    public int UserId { get; set; }
    public IEnumerable<ActivityDto> Activities { get; set; } = new List<ActivityDto>();
}