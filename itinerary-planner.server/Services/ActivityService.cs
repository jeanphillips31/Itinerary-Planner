using itinerary_planner.server.DTOs;

namespace itinerary_planner.server.Services;

public class ActivityService(IActivityRepository activityRepository) : IActivityService
{
    /// <summary>
    /// Gets a list of activities for a specific Itinerary
    /// </summary>
    public Task<IEnumerable<ActivityDto>> GetActivitiesByItineraryId(int id)
    {
        throw new NotImplementedException();
    }

    /// <summary>
    ///  Adds new activities to the database
    /// </summary>
    public Task AddActivitiesAsync(IEnumerable<ActivityDto> activities)
    {
        throw new NotImplementedException();
    }

    /// <summary>
    ///  Updates existing activities
    /// </summary>
    public Task UpdateActivitiesAsync(IEnumerable<ActivityDto> activities)
    {
        throw new NotImplementedException();
    }

    /// <summary>
    ///  Soft deletes a singular activity
    /// </summary>
    public Task DeleteActivityAsync(int id)
    {
        throw new NotImplementedException();
    }

    /// <summary>
    ///  Soft deletes all activities tied to a itinerary 
    /// </summary>
    public Task DeleteActivitiesByItineraryIdAsync(int itineraryId)
    {
        throw new NotImplementedException();
    }
}