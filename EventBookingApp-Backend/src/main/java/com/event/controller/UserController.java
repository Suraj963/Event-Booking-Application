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

import com.event.entity.EventEntity;
import com.event.entity.UserEntity;
import com.event.handler.ApiResponse;
import com.event.service.UserService;

@RestController
@CrossOrigin(origins = "*", allowCredentials = "false")
@RequestMapping("/api/auth")
public class UserController { 
	
	@Autowired
	UserService userService;
	
//	USER REGISTRATION
	@PostMapping("/user/signUp")
	public ApiResponse<UserEntity> signUp(@RequestBody UserEntity user) {
		return userService.signUp(user);
	}
	
//	LOGIN
	@PostMapping("/user/signIn")
	public ApiResponse<Map<String, Object>> signIn(@RequestParam String phone, @RequestParam String password) {
	    return userService.signIn(phone, password);
	}
	
//	GET SINGLE USER DETAILS
	@GetMapping("/user/getUser")
	public ApiResponse<UserEntity> getUser(@RequestHeader("Authorization") String authHeader) {
		return userService.getUser(authHeader);
	}
	
//	UPDATE PASSWORD
	@PutMapping("/user/updateUserPassword")
	public ApiResponse<String> updateUserPassword(@RequestParam String currentPassword, @RequestParam String newPassword, @RequestHeader("Authorization") String authHeader) {
		return userService.updateUserPassword(currentPassword, newPassword, authHeader);
	}
	
//	GET ALL USERS
	@GetMapping("/user/getAllUsers")
	public ApiResponse<List<UserEntity>> getAllUsers(
		    @RequestParam(value = "search", required = false) String searchTerm)
	{
		    return userService.getAllUsers(searchTerm);
	}
	


}
