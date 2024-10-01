package com.swp391.koi_ordering_system.controller;

import com.swp391.koi_ordering_system.model.Booking;
import com.swp391.koi_ordering_system.model.Farm;
import com.swp391.koi_ordering_system.service.FarmService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/farm")
public class FarmController {
    @Autowired
    private FarmService farmService;

    @RequestMapping("/create")
    public ResponseEntity<Farm> createFarm(@RequestBody Farm farm) {
        return ResponseEntity.ok(farmService.createFarm(farm));
    }

    @RequestMapping("/list")
    public ResponseEntity<List<Farm>> getAllFarm() {
        return ResponseEntity.ok(farmService.getAllFarm());
    }

    @RequestMapping("/get/{id}")
    public ResponseEntity<Optional<Farm>> getBookingById(@PathVariable String id) {
        Optional<Farm> booking = farmService.getFarmById(id);
        if (booking.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(booking);
    }

    @RequestMapping("/update/{id}")
    public ResponseEntity<Farm> updateFarm(@PathVariable String id, @RequestBody Farm farmDetails) {
        Farm updatedFarm = farmService.updateFarm(id, farmDetails);
        if (updatedFarm == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedFarm);
    }

    @RequestMapping("/delete/{id}")
    public ResponseEntity<String> deleteFarm(@PathVariable String id) {
        farmService.deleteFarm(id);
        return ResponseEntity.ok("Farm deleted successfully");
    }
}
