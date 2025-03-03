using itinerary_planner.server.Models;

namespace itinerary_planner.server.Services;

public interface IActivityRepository
{
    Task<IEnumerable<Activity>> GetActivitiesByItineraryId(int id);
    Task<Activity?> GetActivityByIdAsync(int activityId);
    Task AddActivitiesAsync(IEnumerable<Activity> activities);
    Task UpdateActivityAsync(Activity activity);
    Task DeleteActivityAsync(int id);
    Task DeleteActivitiesByItineraryIdAsync(int itineraryId);
}