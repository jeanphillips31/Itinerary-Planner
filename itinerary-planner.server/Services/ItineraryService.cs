using itinerary_planner.server.DTOs;
using itinerary_planner.server.Models;
using itinerary_planner.server.Repositories;

namespace itinerary_planner.server.Services;

public class ItineraryService(IItineraryRepository itineraryRepository) : IItineraryService
{
    /// <summary>
    ///  Retrieves all Itineraries as a DTO
    /// </summary>
    public async Task<IEnumerable<ItineraryDto>> GetAllItinerariesAsync()
    {
        var itineraries = await itineraryRepository.GetAllItinerariesAsync();

        return itineraries.Select(i => new ItineraryDto
        {
            Id = i.Id,
            Title = i.Title,
            ImageUrl = i.ImageUrl,
            StartDate = i.StartDate,
            EndDate = i.EndDate,
            Activities = i.Activities.Select(a => new ActivityDto
            {
                Id = a.Id,
                Date = a.Date,
                Name = a.Name,
                Location = a.Location,
                Latitude = a.Latitude,
                Longitude = a.Longitude,
                StartTime = a.StartTime,
                EndTime = a.EndTime
            })
        });
    }

    /// <summary>
    /// Gets a specific Itinerary as a DTO
    /// </summary>
    public async Task<ItineraryDto> GetItineraryByIdAsync(int id)
    {
        var itinerary = await itineraryRepository.GetItineraryByIdAsync(id);

        if (itinerary == null)
        {
            throw new ArgumentException($"No itinerary found with id: {id}");
        }

        return new ItineraryDto
        {
            Id = itinerary.Id,
            Title = itinerary.Title,
            ImageUrl = itinerary.ImageUrl,
            StartDate = itinerary.StartDate,
            EndDate = itinerary.EndDate,
            Activities = itinerary.Activities.Select(a => new ActivityDto
            {
                Id = a.Id,
                Date = a.Date,
                Name = a.Name,
                Location = a.Location,
                Latitude = a.Latitude,
                Longitude = a.Longitude,
                StartTime = a.StartTime,
                EndTime = a.EndTime
            })
        };
    }

    /// <summary>
    ///  Adds a new Itinerary to the database
    /// </summary>
    public async Task<int> AddItineraryAsync(ItineraryDto itineraryDto)
    {
        var itinerary = new Itinerary
        {
            ImageUrl = itineraryDto.ImageUrl,
            StartDate = itineraryDto.StartDate,
            EndDate = itineraryDto.EndDate,
            Title = itineraryDto.Title,
            UserId = itineraryDto.UserId
        };

        await itineraryRepository.AddItineraryAsync(itinerary);

        return itinerary.Id;
    }

    /// <summary>
    ///  Updates an existing Itinerary in the database
    /// </summary>
    public async Task UpdateItineraryAsync(int id, ItineraryDto itineraryDto)
    {
        var itinerary = await itineraryRepository.GetItineraryByIdAsync(id);

        if (itinerary == null)
        {
            throw new ArgumentException($"No itinerary found with id: {id}");
        }

        itinerary.Title = itineraryDto.Title;
        itinerary.ImageUrl = itineraryDto.ImageUrl;
        itinerary.StartDate = itineraryDto.StartDate;
        itinerary.EndDate = itineraryDto.EndDate;
        await itineraryRepository.UpdateItineraryAsync(itinerary);
    }

    /// <summary>
    ///  Soft deletes an Itinerary from the database
    /// </summary>
    public async Task DeleteItineraryAsync(int id)
    {
        var itinerary = await itineraryRepository.GetItineraryByIdAsync(id);
        if (itinerary == null)
        {
            throw new ArgumentException($"No itinerary found with id: {id}");
        }

        await itineraryRepository.DeleteItineraryAsync(id);
    }
}