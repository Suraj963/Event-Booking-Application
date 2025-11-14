package com.event.repo;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Component;

import com.event.entity.BookingEntity;

@Component
public interface BookingRepo extends CrudRepository<BookingEntity, String> {

	 // Find bookings by user ID
    List<BookingEntity> findByUserId(String userId);
    
    // Find bookings by event ID
    List<BookingEntity> findByEventId(String eventId);
    
    @Query("SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END FROM BookingEntity b " +
            "WHERE b.userId = :userId AND b.eventId = :eventId AND b.status != :status")
     boolean existsActiveBookingByUserIdAndEventId(@Param("userId") String userId, 
                                                  @Param("eventId") String eventId, 
                                                  @Param("status") String status);
    
    @Query("SELECT b, e FROM BookingEntity b, EventEntity e WHERE b.eventId = e.id AND b.userId = :userId")
    List<Object[]> findBookingsWithEventsByUserId(@Param("userId") String userId);
}
