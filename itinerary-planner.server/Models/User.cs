namespace itinerary_planner.server.Models;

public class User
{
    public int Id { get; set; }
    public required string Username { get; set; }
    public required string Password { get; set; }
    public required string Email { get; set; }
    
    public ICollection<Itinerary> Itineraries { get; } = new List<Itinerary>();
}