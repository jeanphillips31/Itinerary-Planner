using itinerary_planner.server.Models;
using itinerary_planner.server.Services;
using Microsoft.EntityFrameworkCore;

namespace itinerary_planner.server.Repositories;

public class ActivityRepository(ApplicationDbContext context) : IActivityRepository
{
    /// <summary>
    /// Gets a list of activities for a specific Itinerary from the database
    /// </summary>
    public async Task<IEnumerable<Activity>> GetActivitiesByItineraryId(int id)
    {
        return await context.Activities.Where(a => a.ItineraryId == id).ToListAsync();
    }

    /// <summary>
    ///  Gets an activity by the ID
    /// </summary>
    public async Task<Activity?> GetActivityByIdAsync(int activityId)
    {
        return await context.Activities.FirstOrDefaultAsync(a => a.Id == activityId);
    }

    /// <summary>
    ///  Adds new activities to the database
    /// </summary>
    public async Task AddActivitiesAsync(IEnumerable<Activity> activities)
    {
        foreach (var activity in activities)
        {
            await context.Activities.AddAsync(activity);
        }
        await context.SaveChangesAsync();
    }

    /// <summary>
    /// Adds a new activity to the database
    /// </summary>
    public async Task AddActivityAsync(Activity activity)
    {
        await context.Activities.AddAsync(activity);
        await context.SaveChangesAsync();
    }

    /// <summary>
    ///  Updates an existing activity in the database
    /// </summary>
    public async Task UpdateActivityAsync(Activity activity)
    {
        context.Activities.Update(activity);
        await context.SaveChangesAsync();
    }

    /// <summary>
    ///  Soft deletes an activity from the database
    /// </summary>
    public async Task DeleteActivityAsync(int id)
    {
        var activity = await context.Activities.FindAsync(id);
        if (activity != null)
        {
            activity.Active = false;
        }
        await context.SaveChangesAsync();
    }

    /// <summary>
    ///  Soft deletes activities from the database based on the itineraryId
    /// </summary>
    public async Task DeleteActivitiesByItineraryIdAsync(int itineraryId)
    {
        var activities = await context.Activities
            .Where(a => a.ItineraryId == itineraryId)
            .ToListAsync();

        foreach (var activity in activities)
        {
            activity.Active = false;
        }
        await context.SaveChangesAsync();
    }
}