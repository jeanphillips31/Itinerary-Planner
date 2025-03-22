using itinerary_planner.server.DTOs;
using itinerary_planner.server.Models;

namespace itinerary_planner.server.Services;

public class ActivityService(IActivityRepository activityRepository) : IActivityService
{
    /// <summary>
    /// Gets a list of activities for a specific Itinerary
    /// </summary>
    public async Task<IEnumerable<ActivityDto>> GetActivitiesByItineraryId(int id)
    {
        var activities = await activityRepository.GetActivitiesByItineraryId(id);
        return activities.Select(a => new ActivityDto
        {
            Id = a.Id,
            Name = a.Name,
            Date = a.Date,
            EndTime = a.EndTime,
            StartTime = a.StartTime,
            Latitude = a.Latitude,
            Longitude = a.Longitude,
            Location = a.Location
        });
    }

    /// <summary>
    ///  Adds a new activity to the database
    /// </summary>
    public async Task<int> AddActivityAsync(ActivityDto activityDto, int itineraryId)
    {
        var activity = new Activity
        {
            Name = activityDto.Name,
            Date = activityDto.Date,
            EndTime = activityDto.EndTime,
            StartTime = activityDto.StartTime,
            Latitude = activityDto.Latitude,
            Longitude = activityDto.Longitude,
            Location = activityDto.Location,
            ItineraryId = itineraryId
        };

        await activityRepository.AddActivityAsync(activity);

        return activity.Id;
    }


    /// <summary>
    ///  Updates existing activities, if it doesn't exist then add it
    /// </summary>
    public async Task UpdateActivitiesAsync(IEnumerable<ActivityDto> activities, int itineraryId)
    {
        var activitiesToAdd = new List<Activity>();
        foreach (var activityDto in activities)
        {
            var activity = await activityRepository.GetActivityByIdAsync(activityDto.Id);

            if (activity != null)
            {
                activity.Name = activityDto.Name;
                activity.Date = activityDto.Date;
                activity.EndTime = activityDto.EndTime;
                activity.StartTime = activityDto.StartTime;
                activity.Latitude = activityDto.Latitude;
                activity.Longitude = activityDto.Longitude;
                activity.Location = activityDto.Location;
                await activityRepository.UpdateActivityAsync(activity);
            }
            else
            {
                var activityModel = new Activity
                {
                    Id = activityDto.Id,
                    Name = activityDto.Name,
                    Date = activityDto.Date,
                    EndTime = activityDto.EndTime,
                    StartTime = activityDto.StartTime,
                    Latitude = activityDto.Latitude,
                    Longitude = activityDto.Longitude,
                    Location = activityDto.Location,
                    ItineraryId = itineraryId
                };
                activitiesToAdd.Add(activityModel);
            }
        }

        if (activitiesToAdd.Count != 0)
        {
            await activityRepository.AddActivitiesAsync(activitiesToAdd);
        }
    }

    /// <summary>
    ///  Soft deletes a singular activity
    /// </summary>
    public async Task DeleteActivityAsync(int id)
    {
        var activity = await activityRepository.GetActivityByIdAsync(id);

        if (activity == null)
        {
            throw new ArgumentException($"No activity found with id: {id}");
        }

        await activityRepository.DeleteActivityAsync(id);
    }

    /// <summary>
    ///  Soft deletes all activities tied to an itinerary 
    /// </summary>
    public async Task DeleteActivitiesByItineraryIdAsync(int itineraryId)
    {
        await activityRepository.DeleteActivitiesByItineraryIdAsync(itineraryId);
    }
}