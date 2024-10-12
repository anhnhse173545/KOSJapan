package com.swp391.koi_ordering_system.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "trip_destinations")
public class TripDestination {
    @Id
    @Column(name = "id")
    private String id;

    @JsonBackReference(value = "trip-destination")
    @ManyToOne
    @JoinColumn(name = "trip_id")
    private Trip trip;

    @ManyToOne
    @JoinColumn(name = "farm_id")
    private Farm farm;

    @Column(name = "visit_date")
    private LocalDateTime visitDate;

    @Column(name = "description")
    private String description;

    @ColumnDefault("false")
    @Column(name = "is_deleted")
    private Boolean isDeleted = false;

}