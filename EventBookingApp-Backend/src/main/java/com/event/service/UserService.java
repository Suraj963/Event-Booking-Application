package com.event.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.event.entity.EventEntity;
import com.event.entity.UserEntity;
import com.event.handler.ApiException;
import com.event.handler.ApiResponse;
import com.event.repo.UserRepo;
import com.event.util.JwtUtil;

@Component
public class UserService {
	
	@Autowired
    private JwtUtil jwtUtil; 
	
	@Autowired
	UserRepo userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder; // BCrypt encoder from Security Config

	    public ApiResponse<UserEntity> signUp(UserEntity user) {
	        System.out.println("Starting user registration for: " + user.getPhone());

	        try {
	            // 1. Input Validation
	            validateUserInput(user);

	            // 2. Check if email already exists
	            if (userRepo.existsByPhone(user.getPhone())) {
	                throw new ApiException(HttpStatus.CONFLICT.value(), "User already exists: " + user.getPhone());
	            }

	            // 3. Hash the password using BCrypt
	            String hashedPassword = passwordEncoder.encode(user.getPassword());
	            user.setPassword(hashedPassword);
	            
	            // 4. Set default role if not provided
	            if (user.getRole() == null || user.getRole().isEmpty()) {
	                user.setRole("USER");
	            }

	            // 6. Save user to database
	            UserEntity savedUser = userRepo.save(user);

	            // 7. Remove password from response (security best practice)
	            savedUser.setPassword(null);

	            System.out.println("User registered successfully: " + savedUser.getPhone());

	            return new ApiResponse<>(
	            	HttpStatus.OK.value(),
	                savedUser,
	                "User registered successfully"
	            );

	        } catch (ApiException e) {
	            throw e;
	        } catch (Exception e) {
	            System.err.println("Error during user registration: " + e.getMessage());
	            throw new ApiException(
	                HttpStatus.INTERNAL_SERVER_ERROR.value(),
	                "Registration failed",
	                e.getMessage()
	            );
	        }
	    }

	    // Helper method for input validation
	    private void validateUserInput(UserEntity user) {
	        if (user == null) {
	            throw new ApiException(HttpStatus.BAD_REQUEST.value(), "User data cannot be null");
	        }

	        if (!StringUtils.hasText(user.getName())) {
	            throw new ApiException(HttpStatus.BAD_REQUEST.value(), "Name is required");
	        }

	        if (!StringUtils.hasText(user.getEmail())) {
	            throw new ApiException(HttpStatus.BAD_REQUEST.value(), "Email is required");
	        }

	        if (!isValidEmail(user.getEmail())) {
	            throw new ApiException(HttpStatus.BAD_REQUEST.value(), "Invalid email format");
	        }

	        if (!StringUtils.hasText(user.getPassword())) {
	            throw new ApiException(HttpStatus.BAD_REQUEST.value(), "Password is required");
	        }

	        if (user.getPassword().length() < 6) {
	            throw new ApiException(HttpStatus.BAD_REQUEST.value(), "Password must be at least 6 characters long");
	        }
	    }

	    // Helper method for email validation
	    private boolean isValidEmail(String email) {
	        String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";
	        return email.matches(emailRegex);
	    }

	    public ApiResponse<Map<String, Object>> signIn(String phone, String rawPassword) {
	        try {
	            
	            // Find user by phone
	            Optional<UserEntity> optionalUser = userRepo.findByPhone(phone);
	            
	            if (!optionalUser.isPresent()) {
	                throw new ApiException(HttpStatus.UNAUTHORIZED.value(), "Invalid credentials");
	            }

	            UserEntity user = optionalUser.get();

	            // Verify password using BCrypt
	            if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
	                throw new ApiException(HttpStatus.UNAUTHORIZED.value(), "Invalid credentials");
	            }
	            

	            // Generate JWT token without expiry
	            String token = jwtUtil.generateToken(user.getId(), user.getPhone(), user.getRole());

	            // Remove password from response
	            user.setPassword(null);

	            // Create response with both user details and token
	            Map<String, Object> responseData = new HashMap<>(); 
	            responseData.put("user", user);
	            responseData.put("token", token);

	            return new ApiResponse<>(
	                HttpStatus.OK.value(),
	                responseData,
	                "Login successful"
	            );

	        } catch (ApiException e) {
	            throw e;
	        } catch (Exception e) {
	            System.err.println("SignIn error: " + e.getMessage());
	            e.printStackTrace();
	            throw new ApiException(
	                HttpStatus.INTERNAL_SERVER_ERROR.value(),
	                "Login failed",
	                e.getMessage()
	            );
	        }
	    }

		public ApiResponse<UserEntity> getUser(String authHeader) {
			try {
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
	            
	            
	            Optional<UserEntity> optionalUser = userRepo.findById(userId);
	            
	            UserEntity user = optionalUser.get();
	            
	            user.setPassword(null);
	            
	            return new ApiResponse<>(
	            		HttpStatus.OK.value(),
	                    user,
	                   "Booking fetched successfully");
	            
			}  catch (ApiException e) {
		        // Re-throw custom exceptions
		        throw e;
		    } catch (Exception e) {
		        // Handle any unexpected errors
		        System.err.println("Error fetching User by ID: " + e.getMessage());
		        throw new ApiException(
		            HttpStatus.INTERNAL_SERVER_ERROR.value(),
		            "Failed to fetch user",
		            e.getMessage()
		        );
		    }
		}

		public ApiResponse<String> updateUserPassword(String currentPassword, String newPassword, String authHeader) {
		    try {
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
		        
		        Optional<UserEntity> optionalUser = userRepo.findById(userId);
		        if (!optionalUser.isPresent()) {
		            throw new ApiException(HttpStatus.NOT_FOUND.value(), "User not found");
		        }
		        
		        UserEntity user = optionalUser.get();
		        
		        // Verify current password using BCrypt
		        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
		            throw new ApiException(HttpStatus.UNAUTHORIZED.value(), "Current password is incorrect");
		        }
		        
		        // Validate new password (optional)
		        if (newPassword == null || newPassword.length() < 6) {
		            throw new ApiException(HttpStatus.BAD_REQUEST.value(), "New password must be at least 6 characters long");
		        }
		        
		        // Encode the new password before saving
		        String encodedNewPassword = passwordEncoder.encode(newPassword); 
		        user.setPassword(encodedNewPassword);
		        
		        // Save the updated user entity
		        userRepo.save(user);
		        
		        return new ApiResponse<>(
		            HttpStatus.OK.value(),
		            "Password updated successfully",  // Return message instead of user entity
		            "Password has been changed successfully"
		        );

		    } catch (ApiException e) {
		        // Re-throw custom exceptions
		        throw e;
		    } catch (Exception e) {
		        throw new ApiException(
		            HttpStatus.INTERNAL_SERVER_ERROR.value(),
		            "Failed to update user password",
		            e.getMessage()
		        );
		    }
		}

		public ApiResponse<List<UserEntity>> getAllUsers(String searchTerm) {
			 try {
			        List<UserEntity> users; 
			        
			        // Check if search term is provided
			        if (searchTerm != null && !searchTerm.trim().isEmpty()) {
			            
			            // Use custom search query to search across multiple fields
			            users = userRepo.findBySearchTerm(searchTerm.trim());
			            
			        } else {
			            
			            // Fetch all users if no search term provided
			        	  users = userRepo.findByRole("USER");
			        }
			        
			        // Handle empty list scenario
			        if (users == null || users.isEmpty()) {
			            String message = (searchTerm != null && !searchTerm.trim().isEmpty()) 
			                ? "No users found matching search term: " + searchTerm
			                : "No users found";
			                
			            return new ApiResponse<>(
			                HttpStatus.OK.value(),
			                new ArrayList<>(),
			                message
			            );
			        }
			        
			        // Filter out any null entities (defensive programming)
			        List<UserEntity> validEvents = users.stream()
			            .filter(Objects::nonNull)
			            .collect(Collectors.toList());
			        
			        // Log the result for debugging
			        String message = (searchTerm != null && !searchTerm.trim().isEmpty())
			            ? "Found " + validEvents.size() + " users matching search term: " + searchTerm
			            : "Found " + validEvents.size() + " users";
			        
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
		


}
