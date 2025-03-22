using itinerary_planner.server.DTOs;

namespace itinerary_planner.server.Services;

public interface IActivityService
{
    Task<IEnumerable<ActivityDto>> GetActivitiesByItineraryId(int id);
    Task<int> AddActivityAsync(ActivityDto activityDto, int itineraryId);
    Task UpdateActivitiesAsync(IEnumerable<ActivityDto> activities, int itineraryId);
    Task DeleteActivityAsync(int id);
    Task DeleteActivitiesByItineraryIdAsync(int itineraryId);
}