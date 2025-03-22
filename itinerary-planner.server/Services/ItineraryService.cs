using itinerary_planner.server.DTOs;
using itinerary_planner.server.Models;
using itinerary_planner.server.Repositories;

namespace itinerary_planner.server.Services;

public class ItineraryService(IItineraryRepository itineraryRepository) : IItineraryService
{
    const string baseUrl = "https://localhost:7063/";
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
            ImageUrl = $"{baseUrl}{i.ImageUrl}",
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
            ImageUrl = $"{baseUrl}{itinerary.ImageUrl}",
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
            StartDate = itineraryDto.StartDate,
            EndDate = itineraryDto.EndDate,
            Title = itineraryDto.Title,
            UserId = itineraryDto.UserId,
            ImageUrl = itineraryDto.ImageUrl
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

        if (itineraryDto.Image != null)
        {
            var uploadResult = await UploadImageAsync(itineraryDto.Image);
            if (uploadResult.isSuccess)
            {
                itinerary.ImageUrl = uploadResult.url;
            }
            else
            {
                throw new Exception("Image upload failed.");
            }
        }
        
        itinerary.Title = itineraryDto.Title;
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

    /// <summary>
    ///  Upload the image to the server
    /// </summary>
    public async Task<(bool isSuccess, string url)> UploadImageAsync(IFormFile file)
    {
        try
        {
            if (file == null || file.Length == 0)
                return (false, string.Empty);

            var fileName = Path.GetFileName(file.FileName);
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "uploads");


            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            // Generate a unique file name
            var uniqueFileName = Guid.NewGuid().ToString() + "_" + fileName;
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            // Save the file to the server
            await using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var imageUrl = $"uploads/{uniqueFileName}";
            return (true, $"{baseUrl}{imageUrl}");
        }
        catch (Exception ex)
        {
            return (false, ex.Message);
        }
    }

    /// <summary>
    ///  Updates the itineraries image url
    /// </summary>
    public async Task UpdateItineraryImageAsync(int id, string imageUrl)
    {
        await itineraryRepository.UpdateItineraryImageAsync(id, imageUrl);
    }
}