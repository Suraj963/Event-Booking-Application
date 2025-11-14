package com.event.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.event.entity.BookingEntity;
import com.event.entity.EventEntity;
import com.event.entity.UserEntity;
import com.event.handler.ApiException;
import com.event.handler.ApiResponse;
import com.event.repo.BookingRepo;
import com.event.repo.EventRepo;
import com.event.repo.UserRepo;
import com.event.util.JwtUtil;

@Service
public class BookingService {

	@Autowired
	private JwtUtil jwtUtil;
	
    @Autowired
    private BookingRepo bookingRepo;

    @Autowired
    private EventRepo eventRepo;

    @Autowired
    private UserRepo userRepo;

    @Transactional
    public ApiResponse<BookingEntity> bookEvent(BookingEntity bookEntity, String authHeader) {

        try {
            // 1. Extract and validate user from JWT token
            if (authHeader == null || authHeader.trim().isEmpty()) {
                throw new ApiException(HttpStatus.UNAUTHORIZED.value(), "Authorization header is missing");
            }
            
            // Remove "Bearer " prefix if present, otherwise use the token as is
            String token = authHeader.startsWith("Bearer ") ?  
                authHeader.substring(7) : authHeader;
            
            // Validate token
            if (!jwtUtil.validateToken(token)) {
                throw new ApiException(HttpStatus.UNAUTHORIZED.value(), "Invalid or expired token");
            }
            
            // Extract user ID from token
            String userId = jwtUtil.getUserIdFromToken(token);
            if (userId == null) {
                throw new ApiException(HttpStatus.UNAUTHORIZED.value(), "Unable to extract user ID from token");
            }
            
            // Set userId from token
            bookEntity.setUserId(userId);
            
            // 2. Input Validation
            validateBookingInput(bookEntity);

            // 3. Verify User Exists
            Optional<UserEntity> userOptional = userRepo.findById(bookEntity.getUserId());
            if (!userOptional.isPresent()) {
                throw new ApiException(HttpStatus.NOT_FOUND.value(), "User not found with ID: " + bookEntity.getUserId());
            }
            UserEntity user = userOptional.get();

            // 4. Verify Event Exists and Get Details
            Optional<EventEntity> eventOptional = eventRepo.findById(bookEntity.getEventId());
            if (!eventOptional.isPresent()) {
                throw new ApiException(HttpStatus.NOT_FOUND.value(), "Event not found with ID: " + bookEntity.getEventId());
            }
            EventEntity event = eventOptional.get();

            // 5. Check if user already booked this event (prevent duplicate bookings)
            if (bookingRepo.existsActiveBookingByUserIdAndEventId(bookEntity.getUserId(), bookEntity.getEventId(), "CANCELLED")) {
                throw new ApiException(HttpStatus.CONFLICT.value(), "User has already booked this event");
            }

            // 6. Check Seat Availability (Critical Section)
            if (event.getAvailableSeats() < bookEntity.getSeatsBooked()) {
                throw new ApiException(HttpStatus.CONFLICT.value(), 
                    "Insufficient seats available. Requested: " + bookEntity.getSeatsBooked() + 
                    ", Available: " + event.getAvailableSeats());
            }

            // 7. Calculate Total Amount
            BigDecimal totalAmount = event.getPrice().multiply(new BigDecimal(bookEntity.getSeatsBooked()));
            bookEntity.setTotalAmount(totalAmount);

            // 8. Update Event Seat Availability (Atomic Operation)
            int newAvailableSeats = event.getAvailableSeats() - bookEntity.getSeatsBooked();
            event.setAvailableSeats(newAvailableSeats);

            // 9. Set Booking Details
            bookEntity.setId(UUID.randomUUID().toString());
            
            if (bookEntity.getStatus() == null || bookEntity.getStatus().isEmpty()) {
                bookEntity.setStatus("BOOKED");
            }

            // Generate payment ID (simulate payment processing)
            if (bookEntity.getPaymentId() == null || bookEntity.getPaymentId().isEmpty()) {
                bookEntity.setPaymentId("PAY_" + System.currentTimeMillis());
            }

            // 10. Save Booking
            BookingEntity savedBooking = bookingRepo.save(bookEntity);
            eventRepo.save(event); // Update available seats


            return new ApiResponse<>(
                HttpStatus.OK.value(),
                savedBooking,
                "Event booked successfully"
            );

        } catch (ApiException e) {
            throw e;
        } catch (Exception e) {
            System.err.println("Error during event booking: " + e.getMessage());
            e.printStackTrace();
            throw new ApiException(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Booking failed",
                e.getMessage()
            );
        }
    }

    // Helper method for input validation
    private void validateBookingInput(BookingEntity bookEntity) {
        if (bookEntity == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST.value(), "Booking data cannot be null");
        }

        if (!StringUtils.hasText(bookEntity.getUserId())) {
            throw new ApiException(HttpStatus.BAD_REQUEST.value(), "User ID is required");
        }

        if (!StringUtils.hasText(bookEntity.getEventId())) {
            throw new ApiException(HttpStatus.BAD_REQUEST.value(), "Event ID is required");
        }

        if (bookEntity.getSeatsBooked() <= 0) {
            throw new ApiException(HttpStatus.BAD_REQUEST.value(), "Number of seats must be greater than 0");
        }
    }
    
    
    public ApiResponse<BookingEntity> getBookingById(String bookingId) {
        try {
            if (!StringUtils.hasText(bookingId)) {
                throw new ApiException(HttpStatus.BAD_REQUEST.value(), "Booking ID is required");
            }

            // Use Optional from the default CrudRepository method
            Optional<BookingEntity> optionalBooking = bookingRepo.findById(bookingId);
            
            if (!optionalBooking.isPresent()) {
                throw new ApiException(HttpStatus.NOT_FOUND.value(), "Booking not found with ID: " + bookingId);
            }
            
            BookingEntity booking = optionalBooking.get();

            return new ApiResponse<>(
                HttpStatus.OK.value(),
                booking,
                "Booking fetched successfully"
            );

        } catch (ApiException e) {
            throw e;
        } catch (Exception e) {
            throw new ApiException(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Failed to fetch booking",
                e.getMessage()
            );
        }
    }

    

    public ApiResponse<List<Map<String, Object>>> getUserBookings(String authHeader, String directUserId, String role) {
        try {
            String userId = null;
            
            // Scenario 1: Try to extract userId from token first
            if (authHeader != null && !authHeader.trim().isEmpty() && "USER".equals(role)) {
                try {
                    // Remove "Bearer " prefix if present
                    String token = authHeader.startsWith("Bearer ") ?  
                        authHeader.substring(7) : authHeader;
                    
                    // Validate token
                    if (jwtUtil.validateToken(token)) {
                        userId = jwtUtil.getUserIdFromToken(token);
                    }
                    System.out.println("dfbhhhhhhhhh" + userId);
                } catch (Exception e) {
                	throw new ApiException(HttpStatus.BAD_REQUEST.value(), 
                            "Either valid Authorization token parameter is required");
                }
            } else {
                // Scenario 2: If no valid token, use direct userId
                if (userId == null || userId.trim().isEmpty() && "ADMIN".equals(role)) {
                    if (directUserId != null && !directUserId.trim().isEmpty()) {
                        userId = directUserId.trim();
                        System.out.println("Using direct userId: " + userId);
                    } else {
                        throw new ApiException(HttpStatus.BAD_REQUEST.value(), 
                            "Either valid Authorization token or userId parameter is required");
                    }
                }
            }
            
            // Fetch user bookings with event details (same logic for both scenarios)
            List<Object[]> results = bookingRepo.findBookingsWithEventsByUserId(userId);
            
            List<Map<String, Object>> response = results.stream()
                .map(result -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("booking", result[0]);
                    item.put("event", result[1]);
                    return item;
                })
                .collect(Collectors.toList());
                
            return new ApiResponse<>(HttpStatus.OK.value(), response, "Bookings fetched successfully");
            
        } catch (ApiException e) {
            throw e;
        } catch (Exception e) {
            e.printStackTrace();
            return new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), new ArrayList<>(), "Something went wrong");
        }
    }

    @Transactional
    public ApiResponse<BookingEntity> cancelBooking(String bookingId) {
        try {
            Optional<BookingEntity> bookingOptional = bookingRepo.findById(bookingId);
            if (!bookingOptional.isPresent()) {
                throw new ApiException(HttpStatus.NOT_FOUND.value(), "Booking not found with ID: " + bookingId);
            }

            BookingEntity booking = bookingOptional.get();

            // Check if booking can be cancelled
            if ("CANCELLED".equals(booking.getStatus())) {
                throw new ApiException(HttpStatus.CONFLICT.value(), "Booking is already cancelled");
            }

            // Update event seat availability
            Optional<EventEntity> eventOptional = eventRepo.findById(booking.getEventId());
            if (eventOptional.isPresent()) {
                EventEntity event = eventOptional.get();
                event.setAvailableSeats(event.getAvailableSeats() + booking.getSeatsBooked());
                eventRepo.save(event);
            }

            // Update booking status
            booking.setStatus("CANCELLED");
            BookingEntity updatedBooking = bookingRepo.save(booking);

            return new ApiResponse<>(
                HttpStatus.OK.value(),
                updatedBooking,
                "Booking cancelled successfully"
            );

        } catch (ApiException e) {
            throw e;
        } catch (Exception e) {
            throw new ApiException(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Failed to cancel booking",
                e.getMessage()
            );
        }
    }


}
		