package com.event.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import com.event.entity.EventEntity;
import com.event.entity.UserEntity;

public interface UserRepo extends CrudRepository<UserEntity, String> {
    
    // Check if Phone already exists during registration
    boolean existsByPhone(String phone);
    
    // Find user by Phone for login authentication
    Optional<UserEntity> findByPhone(String phone);
    
    // Count total customers/users
    @Query("SELECT COUNT(u) FROM UserEntity u")
    long countTotalCustomers();
    
    // Search users with role filter
    @Query("SELECT u FROM UserEntity u WHERE " +
           "(LOWER(u.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(u.phone) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
           "AND u.role = 'USER'")
    List<UserEntity> findBySearchTerm(@Param("searchTerm") String searchTerm);
    
    // Find all users with USER role only
    List<UserEntity> findByRole(String role);
}
