package com.swp391.koi_ordering_system.controller;

import com.swp391.koi_ordering_system.service.MediaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/media")
public class MediaController {

    @Autowired
    private MediaService mediaService;

    @PreAuthorize("hasAnyRole('Manager', 'Sales_Staff', 'Consulting_Staff', 'Delivery_Staff' , 'Customer')")
    @PostMapping("/{entity}/{id}/upload/image")
    public ResponseEntity<String> uploadEntityImage(@PathVariable String entity, @PathVariable String id,
                                    @RequestParam("file") MultipartFile file) throws IOException {
         mediaService.uploadEntityImage(id, entity, file);
         return ResponseEntity.ok("Image uploaded");
    }

    @PreAuthorize("hasAnyRole('Manager', 'Sales_Staff', 'Consulting_Staff', 'Delivery_Staff' , 'Customer')")
    @DeleteMapping("/{entity}/{id}/delete/image")
    public ResponseEntity<String> deleteEntityImage(@PathVariable String entity, @PathVariable String id, @RequestParam String url) {
        mediaService.deleteEntityImage(id, entity, url);
        return ResponseEntity.ok("Image deleted");
    }

//    @PreAuthorize("hasRole('Manager')")
//    @PostMapping("farm/{id}/upload/image")
//    public Farm uploadFarmImage(@PathVariable String id, @RequestParam("file") MultipartFile file) throws IOException {
//        return mediaService.uploadFarmImage(id, file);
//    }
//
//    @PostMapping("account/{id}/upload/image")
//    public Account uploadAccountImage(@PathVariable String id, @RequestParam("file") MultipartFile file) throws IOException {
//        return mediaService.uploadAccountImage(id, file);
//    }
//
//    @PreAuthorize("hasRole('Manager') or hasRole('Consulting_Staff')")
//    @PostMapping("fish/{id}/upload/image")
//    public Fish uploadFishImage(@PathVariable String id, @RequestParam("file") MultipartFile file) throws IOException {
//        return mediaService.uploadFishImage(id, file);
//    }
//
//    @PreAuthorize("hasRole('Manager') or hasRole('Consulting_Staff')")
//    @PostMapping("fishpack/{id}/upload/image")
//    public FishPack uploadFishPackImage(@PathVariable String id, @RequestParam("file") MultipartFile file) throws IOException {
//        return mediaService.uploadFishPackImage(id, file);
//    }

//    @GetMapping("/{entityType}/{filename}")
//    public ResponseEntity<Resource> getMedia(@PathVariable String entityType, @PathVariable String filename) {
//        return mediaService.getMedia(entityType, filename);
//    }
}