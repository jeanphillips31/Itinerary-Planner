using itinerary_planner.server.Models;
using itinerary_planner.server.Services;
using Microsoft.EntityFrameworkCore;

namespace itinerary_planner.server.Repositories;

public class ItineraryRepository(ApplicationDbContext context, IActivityRepository activityRepository) : IItineraryRepository
{
    /// <summary>
    ///  Retrieves all Itineraries from the database
    /// </summary>
    public async Task<IEnumerable<Itinerary>> GetAllItinerariesAsync()
    {
        return await context.Itineraries
            .Where(i => i.Active)
            .Include(i => i.Activities)
            .ToListAsync();
    }

    /// <summary>
    /// Gets a specific Itinerary from the database
    /// </summary>
    public async Task<Itinerary?> GetItineraryByIdAsync(int id)
    {
        return await context.Itineraries.FindAsync(id);
    }

    /// <summary>
    ///  Adds a new Itinerary to the database
    /// </summary>
    public async Task AddItineraryAsync(Itinerary itinerary)
    {
        await context.Itineraries.AddAsync(itinerary);
        await context.SaveChangesAsync();
    }

    /// <summary>
    ///  Updates an existing Itinerary in the database
    /// </summary>
    public async Task UpdateItineraryAsync(Itinerary itinerary)
    {
        context.Itineraries.Update(itinerary);
        await context.SaveChangesAsync();
    }

    /// <summary>
    ///  Soft deletes an Itinerary from the database
    /// </summary>
    public async Task DeleteItineraryAsync(int id)
    {
        var itinerary = await context.Itineraries
            .Include(i => i.Activities)
            .FirstOrDefaultAsync(i => i.Id == id);
        
        if (itinerary != null)
        {
            itinerary.Active = false;

            await activityRepository.DeleteActivitiesByItineraryIdAsync(id);
            await context.SaveChangesAsync();
        }
    }
}