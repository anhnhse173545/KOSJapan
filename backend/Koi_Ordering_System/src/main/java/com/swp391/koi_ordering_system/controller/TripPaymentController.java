package com.swp391.koi_ordering_system.controller;

import com.swp391.koi_ordering_system.dto.request.CreateTripPaymentDTO;
import com.swp391.koi_ordering_system.dto.response.TripPaymentDTO;
import com.swp391.koi_ordering_system.mapper.TripPaymentMapper;
import com.swp391.koi_ordering_system.model.TripPayment;
import com.swp391.koi_ordering_system.service.TripPaymentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/trip-payment")
public class TripPaymentController {

    @Autowired
    private TripPaymentService tripPaymentService;

    @Autowired
    private TripPaymentMapper tripPaymentMapper;

    @RequestMapping("/create")
    public ResponseEntity<TripPaymentDTO> createTripPayment(@Valid @RequestBody CreateTripPaymentDTO createTripPaymentDTO) {
        TripPayment tripPayment = tripPaymentMapper.toEntity(createTripPaymentDTO);
        return ResponseEntity.ok(tripPaymentMapper.toDTO(tripPaymentService.createTripPayment(tripPayment)));
    }


    @RequestMapping("/list")
    public ResponseEntity<List<TripPaymentDTO>> getAllTripPayment() {
        return ResponseEntity.ok(tripPaymentService.getAllTripPayment());
    }

    @RequestMapping("/get/{id}")
    public ResponseEntity<Optional<TripPaymentDTO>> getTripPaymentById(@PathVariable String id) {
        Optional<TripPaymentDTO> tripPayment = tripPaymentService.getTripPaymentById(id);
        if (tripPayment.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(tripPayment);
    }


//    @RequestMapping("/update/{id}")
//    public ResponseEntity<TripPayment> updateTripPayment(@PathVariable String id,@RequestBody TripPayment tripPayment) {
//        TripPayment updatedTripPayment = tripPaymentService.updateTripPayment(id, tripPayment);
//        if (updatedTripPayment == null) {
//            return ResponseEntity.notFound().build();
//        }
//        return ResponseEntity.ok(updatedTripPayment);
//    }

    @RequestMapping("/delete/{id}")
    public ResponseEntity<String> deleteTripPayment(@PathVariable String id) {
        tripPaymentService.deleteTripPayment(id);
        return ResponseEntity.ok("Trip Payment deleted successfully");
    }
}