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
    }

    private async Task<Results<Created<int>, BadRequest>> AddActivity(IActivityService activityService,
        ActivityDto activityDto, int itineraryId)
    {
        var id = await activityService.AddActivityAsync(activityDto, itineraryId);
        return TypedResults.Created(nameof(AddActivity), id);
    }
}