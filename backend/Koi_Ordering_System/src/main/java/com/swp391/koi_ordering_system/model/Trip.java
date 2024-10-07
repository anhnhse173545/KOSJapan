package com.swp391.koi_ordering_system.model;

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
    @Column(name = "id", nullable = false, length = 9)
    private String id;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(name = "departure_airport", length = 3)
    private String departureAirport;

    @Column(name = "price")
    private Double price;

    @Column(name = "status", length = 50)
    private String status;

    @ColumnDefault("false")
    @Column(name = "is_deleted")
    private Boolean isDeleted;

    @OneToOne(mappedBy = "trip")
    private Booking booking;

    @ManyToMany
    @JoinTable(
            name = "trip_destinations",
            joinColumns = @JoinColumn(name = "trip_id"),
            inverseJoinColumns = @JoinColumn(name = "farm_id")
    )
    private Set<Farm> farms;
}