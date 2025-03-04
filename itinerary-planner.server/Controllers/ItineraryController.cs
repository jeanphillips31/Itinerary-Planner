using Carter;
using itinerary_planner.server.DTOs;
using itinerary_planner.server.Services;
using Microsoft.AspNetCore.Http.HttpResults;

namespace itinerary_planner.server.Controllers;

public class ItineraryModule : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/itineraries", GetItineraries);
        app.MapGet("/itinerary/{itineraryId:int}", GetItinerary);
        app.MapPost("/add", AddItinerary);
        app.MapPut("/update/{itineraryId:int}", UpdateItinerary);
        app.MapDelete("/delete/{itineraryId:int}", DeleteItinerary);
    }

    private async Task<Results<Ok<IEnumerable<ItineraryDto>>, BadRequest>> GetItineraries(IItineraryService itineraryService)
    {
        var itineraries = await itineraryService.GetAllItinerariesAsync();
        return TypedResults.Ok(itineraries);
    }

    private async Task<Results<Ok<ItineraryDto>, NotFound>> GetItinerary(IItineraryService itineraryService, int itineraryId)
    {
        try
        {
            var itinerary = await itineraryService.GetItineraryByIdAsync(itineraryId);
            return TypedResults.Ok(itinerary);
        }
        catch (KeyNotFoundException)
        {
            return TypedResults.NotFound();
        }
    }
    
    private async Task<Results<Created<int>, BadRequest>> AddItinerary(IItineraryService itineraryService,IActivityService activityService, ItineraryDto itinerary)
    {
        var itineraryId = await itineraryService.AddItineraryAsync(itinerary);
        await activityService.AddActivitiesAsync(itinerary.Activities, itineraryId);
        return TypedResults.Created(nameof(AddItinerary), itineraryId);
    }
    
    private async Task<Results<Ok, NotFound, NoContent>> UpdateItinerary(IItineraryService itineraryService, IActivityService activityService, int itineraryId, ItineraryDto itinerary)
    {
        try
        {
            await itineraryService.UpdateItineraryAsync(itineraryId, itinerary);
            await activityService.UpdateActivitiesAsync(itinerary.Activities);
            return TypedResults.NoContent();
        }
        catch (KeyNotFoundException)
        {
            return TypedResults.NotFound();
        }
    }
    
    private async Task<Results<Ok, NotFound, NoContent>> DeleteItinerary(IItineraryService itineraryService, IActivityService activityService, int itineraryId)
    {
        try
        {
            await itineraryService.DeleteItineraryAsync(itineraryId);
            await activityService.DeleteActivitiesByItineraryIdAsync(itineraryId);
            return TypedResults.NoContent();
        }
        catch (KeyNotFoundException)
        {
            return TypedResults.NotFound();
        }
    }
}