package com.event.repo;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Component;

import com.event.entity.EventEntity;

@Component
public interface EventRepo extends CrudRepository<EventEntity, String> {
	
	  // Combined search across multiple fields using @Query annotation
    @Query("SELECT e FROM EventEntity e WHERE " +
           "LOWER(e.eventName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(e.eventType) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(e.location) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(e.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<EventEntity> findBySearchTerm(@Param("searchTerm") String searchTerm);
    
    // Count total events
    @Query("SELECT COUNT(e) FROM EventEntity e")
    long countTotalEvents();
    
    // Count events this month
    @Query("SELECT COUNT(e) FROM EventEntity e WHERE MONTH(e.createdAt) = MONTH(CURRENT_DATE) AND YEAR(e.createdAt) = YEAR(CURRENT_DATE)")
    long countEventsThisMonth();
    
    // Count distinct cities
    @Query("SELECT COUNT(DISTINCT e.location) FROM EventEntity e")
    long countDistinctCities();
}
