using Carter;
using itinerary_planner.server.DTOs;
using itinerary_planner.server.Services;
using Microsoft.AspNetCore.Http.HttpResults;

namespace itinerary_planner.server.Controllers;

public class ActivityModule : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("/addActivity", AddActivity);
        app.MapPut("/updateActivity/{activityId:int}", UpdateActivity);
        app.MapDelete("/deleteActivity{activityId:int}", DeleteActivity);
    }

    private async Task<Results<Created<int>, BadRequest>> AddActivity(IActivityService activityService,
        ActivityDto activityDto, int itineraryId)
    {
        var id = await activityService.AddActivityAsync(activityDto, itineraryId);
        return TypedResults.Created(nameof(AddActivity), id);
    }

    private async Task<Results<Ok, NotFound, NoContent>> UpdateActivity(IActivityService activityService, int activityId, ActivityDto activityDto)
    {
        try
        {
            await activityService.UpdateActivityAsync(activityDto, activityId);
            return TypedResults.NoContent();
        }
        catch (KeyNotFoundException)
        {
            return TypedResults.NotFound();
        }
    }

    private async Task<Results<Ok, NotFound, NoContent>> DeleteActivity(IActivityService activityService,
        int activityId)
    {
        try
        {
            await activityService.DeleteActivityAsync(activityId);
            return TypedResults.NoContent();

        }
        catch (KeyNotFoundException)
        {
            return TypedResults.NotFound();
        }
    }
}