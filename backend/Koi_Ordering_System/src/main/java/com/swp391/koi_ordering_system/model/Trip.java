package com.swp391.koi_ordering_system.model;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "trips")
public class Trip {
    @Id
    @Column(name = "id", nullable = false)
    private String id;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(name = "departure_airport")
    private String departureAirport;

    @Column(name = "price")
    private Double price;

    @Column(name = "description")
    private String description;

    @Column(name = "status")
    private String status = "Pending";

    @ColumnDefault("false")
    @Column(name = "is_deleted")
    private Boolean isDeleted = false;

    @JsonBackReference(value = "booking-trip")
    @OneToOne(mappedBy = "trip", cascade = CascadeType.ALL)
    private Booking booking;

    @JsonManagedReference(value = "trip-destination")
    @OneToMany(mappedBy = "trip")
    private Set<TripDestination> tripDestinations;
}