package com.event.controller;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.event.entity.EventEntity;
import com.event.handler.ApiResponse;
import com.event.service.EventService;

@RestController
@CrossOrigin(origins = "*", allowCredentials = "false")
public class EventController {
	
	@Autowired
	EventService eventService;
	
//	ADD RECORD
	@PostMapping("/event/add")
	public ApiResponse<EventEntity> addEvent( 
	        @RequestParam("eventName") String eventName,
	        @RequestParam("eventType") String eventType,
	        @RequestParam(value = "description", required = false) String description,
	        @RequestParam("eventDate") String eventDateStr,
	        @RequestParam("eventTime") String eventTimeStr,
	        @RequestParam("location") String location, 
	        @RequestParam("totalSeats") int totalSeats,
	        @RequestParam("availableSeats") int availableSeats,
	        @RequestParam("price") BigDecimal price,
	        @RequestParam(value = "image", required = false) MultipartFile imageFile
	) { 
	    return eventService.addEvent(eventName, eventType, description, eventDateStr, eventTimeStr, location, totalSeats, availableSeats, price, imageFile);
	}

//	UPDATE RECORD
	@PutMapping("/event/update/{id}")
	public ApiResponse<EventEntity> updateEvent( 
			@PathVariable("id") String id,
	        @RequestParam("eventName") String eventName,
	        @RequestParam("eventType") String eventType,
	        @RequestParam(value = "description", required = false) String description,
	        @RequestParam("eventDate") String eventDateStr,
	        @RequestParam("eventTime") String eventTimeStr,
	        @RequestParam("location") String location, 
	        @RequestParam("totalSeats") int totalSeats,
	        @RequestParam("availableSeats") int availableSeats,
	        @RequestParam("price") BigDecimal price,
	        @RequestParam(value = "image", required = false) MultipartFile imageFile
	) { 
				
	    return eventService.updateEvent(id, eventName, eventType, description, eventDateStr, eventTimeStr, location, totalSeats, availableSeats, price, imageFile);
	}
	
//	GET ALL RECORDS
	@GetMapping("/event/getAll")
	public ApiResponse<List<EventEntity>> getAllEvents(
		    @RequestParam(value = "search", required = false) String searchTerm)
	{
		    return eventService.getAllEvents(searchTerm);
	}
	
//	GET SINGLE RECORD
	@GetMapping("event/getById/{id}")
	public ApiResponse<EventEntity> getById(@PathVariable String id) {
		return eventService.getById(id);
	}
	
//	DELETE EVENT
	@DeleteMapping("event/delete/{id}")
	public ApiResponse<EventEntity> delete(@PathVariable String id) {
		return eventService.delete(id);
	}
	
//	GET STATISTICS
	@GetMapping("/event/getStatistics")
	public ApiResponse<Map<String, Object>> getStatistics()
	{
		    return eventService.getStatistics();
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

}
