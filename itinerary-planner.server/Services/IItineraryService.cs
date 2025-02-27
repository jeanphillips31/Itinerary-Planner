using itinerary_planner.server.DTOs;

namespace itinerary_planner.server.Services;

public interface IItineraryService
{
    Task<IEnumerable<ItineraryDto>> GetAllItinerariesAsync();
    Task<ItineraryDto> GetItineraryByIdAsync(int id);
    Task<int> AddItineraryAsync(ItineraryDto itineraryDto);
    Task UpdateItineraryAsync(int id, ItineraryDto itineraryDto);
    Task DeleteItineraryAsync(int id);
}