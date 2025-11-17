package com.event.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    @Autowired
    private Cloudinary cloudinary;

    public String uploadFile(MultipartFile file) {
        try {
            // Upload the file to Cloudinary
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());

            // Get the public URL of the uploaded image
            // We use "secure_url" to get the https URL
            return (String) uploadResult.get("secure_url");
            
        } catch (IOException e) {
            // Handle the exception (e.g., log it, throw a custom exception)
            throw new RuntimeException("Could not upload file", e);
        }
    }
    
    public void deleteFile(String imageUrl) {
        try {
            // Extract the public_id from the URL.
            String publicId = extractPublicIdFromUrl(imageUrl);
            
            if (publicId != null) {
                // Call Cloudinary's destroy method
                // "image" is the default resource type. 
                cloudinary.uploader().destroy(publicId, ObjectUtils.asMap("resource_type", "image"));
            }
        } catch (IOException e) {
            // Log the error, but don't re-throw. We still want to delete the DB record.
            System.err.println("Failed to delete image from Cloudinary: " + imageUrl + " - " + e.getMessage());
        }
    }

    private String extractPublicIdFromUrl(String imageUrl) {
        try {
            // Find the "upload/" part
            int uploadIndex = imageUrl.indexOf("/upload/");
            if (uploadIndex == -1) return null; // Not a valid Cloudinary upload URL

            // Get the part after "upload/" (e.g., "v123456/public_id.ext")
            String afterUpload = imageUrl.substring(uploadIndex + 8); // length of "/upload/"

            // Find the version part (e.g., "v123456/")
            int versionIndex = afterUpload.indexOf("/");
            if (versionIndex == -1 || !afterUpload.startsWith("v")) {
                 // No version, so 'afterUpload' is "public_id.ext"
                 int lastDot = afterUpload.lastIndexOf(".");
                 if (lastDot != -1) {
                     return afterUpload.substring(0, lastDot);
                 }
                 return afterUpload; // No extension
            }

            // Get the part after the version (e.g., "public_id.ext" or "folder/public_id.ext")
            String publicIdWithExt = afterUpload.substring(versionIndex + 1);

            // Find the last dot to remove the extension
            int lastDot = publicIdWithExt.lastIndexOf(".");
            if (lastDot != -1) {
                return publicIdWithExt.substring(0, lastDot);
            }
            return publicIdWithExt; // No extension
            
        } catch (Exception e) {
            System.err.println("Could not extract public_id from URL: " + imageUrl);
            return null;
        }
    }
}