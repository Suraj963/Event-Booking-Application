package com.event.service;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Date;
import java.sql.Time;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.event.entity.EventEntity;
import com.event.handler.ApiException;
import com.event.handler.ApiResponse;
import com.event.repo.EventRepo;
import com.event.repo.UserRepo;

@Component
public class EventService {
	
	@Autowired
	EventRepo eventRepo;
	
	@Autowired
	private UserRepo userRepo;
	
	@Autowired
    private CloudinaryService cloudinaryService;
	
	// This is no longer needed for file uploads
	// @Value("${app.upload.dir}")
	// private String uploadDir;

	public ApiResponse<EventEntity> addEvent(
	        String eventName,
	        String eventType,
	        String description,
	        String eventDateStr,
	        String eventTimeStr,
	        String location,
	        int totalSeats,
	        int availableSeats,
	        BigDecimal price,
	        MultipartFile imageFile) {
		
		
		String formattedTimeStr = eventTimeStr.replace("-", ":");
		Date eventDate = Date.valueOf(eventDateStr);
		Time eventTime = Time.valueOf(formattedTimeStr);

	    if (eventName == null || eventName.isEmpty()) {
	        throw new ApiException(HttpStatus.BAD_REQUEST.value(), "Event name cannot be empty");
	    }

	    EventEntity event = new EventEntity();
	    event.setEventName(eventName);
	    event.setEventType(eventType);
	    event.setDescription(description);
	    event.setEventDate(eventDate);
	    event.setEventTime(eventTime);
	    event.setLocation(location);
	    event.setTotalSeats(totalSeats);
	    event.setAvailableSeats(availableSeats);
	    event.setPrice(price);

	    // --- UPDATED IMAGE HANDLING ---
	    try {
	        if (imageFile != null && !imageFile.isEmpty()) {
                // 1. Upload the file to Cloudinary
	            String imageUrl = cloudinaryService.uploadFile(imageFile);

                // 2. Save the returned URL to the event entity
	            event.setImage(imageUrl);
	        }
	    } catch (Exception e) {
            // Catch any exception from the Cloudinary upload
	        throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Error while uploading event image", e.getMessage());
	    }
	    // --- END OF UPDATE ---

	    // Save event to DB
	    EventEntity saved = eventRepo.save(event);

	    return new ApiResponse<>(
	    		HttpStatus.OK.value(),
	            saved,
	            "Event added successfully"
	    );
	}
	
	
	public ApiResponse<EventEntity> updateEvent(String id, String eventName, String eventType, String description, String eventDateStr,
	        String eventTimeStr, String location, int totalSeats, int availableSeats, BigDecimal price,
	        MultipartFile imageFile) {

	    System.out.println("Updating event with ID: " + id);
	    
	    // Format time string from "HH-mm-ss" to "HH:mm:ss"
	    String formattedTimeStr = eventTimeStr.replace("-", ":");
	    Date eventDate = Date.valueOf(eventDateStr);
	    Time eventTime = Time.valueOf(formattedTimeStr);

	    // Find existing entity using Optional
	    Optional<EventEntity> optionalEntity = eventRepo.findById(id);
	    
	    if (!optionalEntity.isPresent()) {
	        throw new ApiException(HttpStatus.NOT_FOUND.value(), "Event not found with ID: " + id);
	    }
	    
	    EventEntity entity = optionalEntity.get();

	    // Validate required fields
	    if (eventName == null || eventName.isEmpty()) {
	        throw new ApiException(HttpStatus.BAD_REQUEST.value(), "Event name cannot be empty");
	    }

	    // Update entity fields
	    entity.setEventName(eventName);
	    entity.setEventType(eventType);
	    entity.setDescription(description);
	    entity.setEventDate(eventDate);
	    entity.setEventTime(eventTime);
	    entity.setLocation(location);
	    entity.setTotalSeats(totalSeats);
	    entity.setAvailableSeats(availableSeats);
	    entity.setPrice(price);

	    // --- UPDATED IMAGE HANDLING ---
	    try {
	        if (imageFile != null && !imageFile.isEmpty()) {
	            // NEW IMAGE UPLOADED - Process new image
	            System.out.println("New image uploaded, processing...");
	            
	            // Note: We are not deleting the old image from Cloudinary here,
	            // as that requires more complex logic to extract the public_id
	            // from the URL and make a 'destroy' API call.

	            // 1. Save new image to Cloudinary
	            String newImageUrl = cloudinaryService.uploadFile(imageFile);

	            // 2. Update entity with new image URL
	            entity.setImage(newImageUrl);
	            
	        } 
	        
	    } catch (Exception e) { // Changed to catch any upload exception
	        throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Error while updating event image", e.getMessage());
	    }
        // --- END OF UPDATE ---

	    // Save updated entity to DB
	    EventEntity updatedEntity = eventRepo.save(entity);

	    return new ApiResponse<>(
	            HttpStatus.OK.value(),
	            updatedEntity,
	            "Event updated successfully"
	    );
	}
	
	
	public ApiResponse<List<EventEntity>> getAllEvents(String searchTerm) {
	    try {
	        List<EventEntity> events; 
	        
	        // Check if search term is provided
	        if (searchTerm != null && !searchTerm.trim().isEmpty()) {
	            
	            // Use custom search query to search across multiple fields
	            events = eventRepo.findBySearchTerm(searchTerm.trim());
	            
	        } else {
	            
	            // Fetch all events if no search term provided
	            events = (List<EventEntity>) eventRepo.findAll();
	        }
	        
	        // Handle empty list scenario
	        if (events == null || events.isEmpty()) {
	            String message = (searchTerm != null && !searchTerm.trim().isEmpty()) 
	                ? "No events found matching search term: " + searchTerm
	                : "No events found";
	                
	            return new ApiResponse<>(
	                HttpStatus.OK.value(),
	                new ArrayList<>(),
	                message
	            );
	        }
	        
	        // Filter out any null entities 
	        List<EventEntity> validEvents = events.stream()
	            .filter(Objects::nonNull)
	            .collect(Collectors.toList());
	        
	        // Log the result
	        String message = (searchTerm != null && !searchTerm.trim().isEmpty())
	            ? "Found " + validEvents.size() + " events matching search term: " + searchTerm
	            : "Found " + validEvents.size() + " events";  
	        
	        return new ApiResponse<>(
	            HttpStatus.OK.value(),
	            validEvents,
	            message
	        );
	        
	    } catch (Exception e) {
	        // Handle any database or system errors
	        System.err.println("Error fetching events: " + e.getMessage());
	        throw new ApiException(
	            HttpStatus.INTERNAL_SERVER_ERROR.value(), 
	            "Failed to fetch events", 
	            e.getMessage()
	        );
	    }
	}


	public ApiResponse<EventEntity> getById(String id) {
	    // Input validation
	    if (id == null || id.trim().isEmpty()) {
	        throw new ApiException(HttpStatus.BAD_REQUEST.value(), "Event ID cannot be null or empty");
	    }
	    
	    try {
	        // Find entity using Optional
	        Optional<EventEntity> optionalEntity = eventRepo.findById(id);
	        
	        if (!optionalEntity.isPresent()) {
	            throw new ApiException(HttpStatus.NOT_FOUND.value(), "Event not found with ID: " + id);
	        }
	        
	        EventEntity event = optionalEntity.get();
	        
	        return new ApiResponse<>(
	            HttpStatus.OK.value(),
	            event,
	            "Event fetched successfully"
	        );
	        
	    } catch (ApiException e) {
	        // Re-throw custom exceptions
	        throw e;
	    } catch (Exception e) {
	        // Handle any unexpected errors
	        System.err.println("Error fetching event by ID: " + e.getMessage());
	        throw new ApiException(
	            HttpStatus.INTERNAL_SERVER_ERROR.value(),
	            "Failed to fetch event",
	            e.getMessage()
	        );
	    }
	}


	    // You can now DELETE the '@Value("${app.upload.dir}") private String uploadDir;' field
	    // from your class, as it is no longer needed.

		public ApiResponse<EventEntity> delete(String id) {
		    // Input validation
		    if (id == null || id.trim().isEmpty()) {
		        throw new ApiException(HttpStatus.BAD_REQUEST.value(), "Event ID cannot be null or empty");
		    }
		    
		    System.out.println("Attempting to delete event with ID: " + id);
		    
		    try {
		        // Find existing entity first
		        Optional<EventEntity> optionalEntity = eventRepo.findById(id);
		        
		        if (!optionalEntity.isPresent()) {
		            throw new ApiException(HttpStatus.NOT_FOUND.value(), "Event not found with ID: " + id);
		        }
		        
		        EventEntity eventToDelete = optionalEntity.get();
		        System.out.println("Found event to delete: " + eventToDelete.getEventName());
		        
		        // --- UPDATED IMAGE HANDLING ---
		        // Delete associated image from Cloudinary if it exists
		        String imageUrl = eventToDelete.getImage();
		        if (imageUrl != null && !imageUrl.isEmpty()) {
		            // We wrap this in its own try/catch block because we want to
		            // delete the database record even if the cloud deletion fails.
		            try {
		                cloudinaryService.deleteFile(imageUrl);
		                System.out.println("Successfully deleted image from Cloudinary: " + imageUrl);
		            } catch (Exception e) {
		                // Log error but don't fail the entire delete operation
		                System.err.println("Failed to delete image from Cloudinary: " + imageUrl + " - " + e.getMessage());
		            }
		        }
		        // --- END OF UPDATE ---
		        
		        // Delete entity from database
		        eventRepo.delete(eventToDelete);
		        System.out.println("Successfully deleted event from database: " + eventToDelete.getEventName());
		        
		        return new ApiResponse<>(
		            HttpStatus.OK.value(),
		            eventToDelete,  // Return the deleted entity info
		            "Event deleted successfully"
		        );
		        
		    } catch (ApiException e) {
		        // Re-throw custom exceptions
		        throw e;
		    } catch (Exception e) {
		        // Handle any unexpected errors
		        System.err.println("Error deleting event: " + e.getMessage());
		        throw new ApiException(
		            HttpStatus.INTERNAL_SERVER_ERROR.value(),
		            "Failed to delete event",
		            e.getMessage()
		        );
		    }
		}
	
	public ApiResponse<Map<String, Object>> getStatistics() {
        try {
            
            // Get all counts
            long totalEvents = eventRepo.countTotalEvents();
            long eventsThisMonth = eventRepo.countEventsThisMonth();
            long totalCities = eventRepo.countDistinctCities();
            long totalCustomers = userRepo.countTotalCustomers();
            
            // Create response map without DTO
            Map<String, Object> statistics = new HashMap<>();
            statistics.put("totalEvents", totalEvents);
            statistics.put("eventsThisMonth", eventsThisMonth);
            statistics.put("totalCities", totalCities);
            statistics.put("totalCustomers", totalCustomers);
            
            return new ApiResponse<>(
                HttpStatus.OK.value(),
                statistics,
                "Statistics fetched successfully"
            );
            
        } catch (Exception e) {
            System.err.println("Error fetching statistics: " + e.getMessage());
            e.printStackTrace();
            throw new ApiException(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Failed to fetch statistics",
                e.getMessage()
            );
        }
    }




}
