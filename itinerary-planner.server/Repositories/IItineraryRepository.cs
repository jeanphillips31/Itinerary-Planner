using itinerary_planner.server.Models;

namespace itinerary_planner.server.Repositories;

public interface IItineraryRepository
{
    Task<IEnumerable<Itinerary>> GetAllItinerariesAsync();
    Task<Itinerary?> GetItineraryByIdAsync(int id);
    Task AddItineraryAsync(Itinerary itinerary);
    Task UpdateItineraryAsync(Itinerary itinerary);
    Task DeleteItineraryAsync(int id);
    Task UpdateItineraryImageAsync(int id, string imageUrl);
}