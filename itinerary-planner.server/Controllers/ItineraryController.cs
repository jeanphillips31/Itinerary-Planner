using Carter;
using itinerary_planner.server.DTOs;
using itinerary_planner.server.Services;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

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
        app.MapPost("/upload-image", UploadImageAsync).DisableAntiforgery();
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
        //await activityService.AddActivitiesAsync(itinerary.Activities, itineraryId);
        Console.WriteLine($"Added itinerary {itineraryId}");
        return TypedResults.Created(nameof(AddItinerary), itineraryId);
    }
    
    private async Task<Results<Ok, NotFound, NoContent>> UpdateItinerary(IItineraryService itineraryService, IActivityService activityService, int itineraryId, ItineraryDto itinerary)
    {
        try
        {
            await itineraryService.UpdateItineraryAsync(itineraryId, itinerary);
            await activityService.UpdateActivitiesAsync(itinerary.Activities, itineraryId);
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

    private async Task<Results<Ok<string>, BadRequest>> UploadImageAsync(IItineraryService itineraryService, [FromForm] IFormFile file)
    {
        var result = await itineraryService.UploadImageAsync(file);
        if (!result.isSuccess)
        {
            return TypedResults.BadRequest();
        }
        return TypedResults.Ok(result.url);
    }
}