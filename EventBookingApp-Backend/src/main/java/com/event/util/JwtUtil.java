package com.event.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Base64;

@Component
public class JwtUtil {

    @Value("${jwt.secret:mySecretKeyForTokenGeneration123456789}")
    private String tokenSecret;

    // Generate token without expiry
    public String generateToken(String userId, String phone, String role) {
        
        long timestamp = System.currentTimeMillis();
        String tokenData = String.format("token_%s_%s_%s_%d_%s", 
            userId, phone, role, timestamp, tokenSecret);
        
        // Base64 encode for JWT-like appearance
        String encodedToken = Base64.getEncoder().encodeToString(tokenData.getBytes());
        
        return encodedToken;
    }

    // Validate token
    public boolean validateToken(String token) {
        try {
            if (token == null || token.trim().isEmpty()) {
                return false;
            }

            // Decode the token
            String decodedToken = new String(Base64.getDecoder().decode(token));
            
            // Check if token has correct format and contains our secret
            return decodedToken.startsWith("token_") && decodedToken.contains(tokenSecret);

        } catch (Exception e) {
            return false;
        }
    }

    // Extract user ID from token
    public String getUserIdFromToken(String token) {
        try {
            if (!validateToken(token)) {
                return null;
            }

            String decodedToken = new String(Base64.getDecoder().decode(token));
            // Format: token_userId_phone_role_timestamp_secret
            String[] parts = decodedToken.split("_");
            
            return parts.length >= 2 ? parts[1] : null;

        } catch (Exception e) {
            return null;
        }
    }

    // Extract phone from token
    public String getPhoneFromToken(String token) {
        try {
            if (!validateToken(token)) {
                return null;
            }

            String decodedToken = new String(Base64.getDecoder().decode(token));
            String[] parts = decodedToken.split("_");
            
            return parts.length >= 3 ? parts[2] : null;

        } catch (Exception e) {
            return null;
        }
    }

    // Extract role from token
    public String getRoleFromToken(String token) {
        try {
            if (!validateToken(token)) {
                return null;
            }

            String decodedToken = new String(Base64.getDecoder().decode(token));
            String[] parts = decodedToken.split("_");
            
            return parts.length >= 4 ? parts[3] : null;

        } catch (Exception e) {
            return null;
        }
    }
}
