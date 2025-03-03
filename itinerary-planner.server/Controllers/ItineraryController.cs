using itinerary_planner.server.DTOs;
using itinerary_planner.server.Services;
using Microsoft.AspNetCore.Mvc;

namespace itinerary_planner.server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ItineraryController(IItineraryService itineraryService, IActivityService activityService, ILogger<ItineraryController> logger) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetItineraries()
    {
        var itineraries = await itineraryService.GetAllItinerariesAsync();
        return Ok(itineraries);
    }

    [HttpGet("{itineraryId:int}")]
    public async Task<IActionResult> GetItinerary(int itineraryId)
    {
        try
        {
            var itinerary = await itineraryService.GetItineraryByIdAsync(itineraryId);
            return Ok(itinerary);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpPost]
    public async Task<IActionResult> AddItinerary(ItineraryDto itinerary)
    {
        var itineraryId = await itineraryService.AddItineraryAsync(itinerary);
        await activityService.AddActivitiesAsync(itinerary.Activities, itineraryId);
        return CreatedAtAction(nameof(AddItinerary), new {id = itineraryId}, itinerary);
    }

    [HttpPut("{itineraryId:int}")]
    public async Task<IActionResult> UpdateItinerary(int itineraryId, ItineraryDto itinerary)
    {
        try
        {
            await itineraryService.UpdateItineraryAsync(itineraryId, itinerary);
            await activityService.UpdateActivitiesAsync(itinerary.Activities);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpDelete("{itineraryId:int}")]
    public async Task<IActionResult> DeleteItinerary(int itineraryId)
    {
        try
        {
            await itineraryService.DeleteItineraryAsync(itineraryId);
            await activityService.DeleteActivitiesByItineraryIdAsync(itineraryId);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }
}