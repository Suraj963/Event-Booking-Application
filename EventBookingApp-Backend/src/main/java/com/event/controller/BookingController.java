package com.event.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.event.entity.BookingEntity;
import com.event.handler.ApiResponse;
import com.event.service.BookingService;

@RestController
@CrossOrigin(origins = "*", allowCredentials = "false")
@RequestMapping("/bookings")
public class BookingController {
	
	@Autowired
	BookingService bookingService;
	
//	EVENT BOOKING
	@PostMapping("/bookEvent")
	public ApiResponse<BookingEntity> bookEvent(@RequestBody BookingEntity bookEntity, 
												@RequestHeader("Authorization") String authHeader) {
		return bookingService.bookEvent(bookEntity, authHeader);
	}
	
//	GET BOOKING BY ID
	@GetMapping("/getBookingById/{userId}")
    public ApiResponse<BookingEntity> getBookingById(@PathVariable String userId) {
        return bookingService.getBookingById(userId);
   }
	
//	GET INDIVIDUAL USER BOOKINGS
	@GetMapping("/getUserBookings")
	public ApiResponse<List<Map<String, Object>>> getUserBookings(
	    @RequestHeader(value = "Authorization", required = false) String authHeader,
	    @RequestParam(value = "userId", required = false) String directUserId,
	    @RequestParam(value = "role", required = true) String role
	) {
	    return bookingService.getUserBookings(authHeader, directUserId, role);
	}


//	CANCEL BOOKING
    @PutMapping("/cancelBooking/{bookingId}")
    public ApiResponse<BookingEntity> cancelBooking(@PathVariable String bookingId) {
        return bookingService.cancelBooking(bookingId);
    }

}
