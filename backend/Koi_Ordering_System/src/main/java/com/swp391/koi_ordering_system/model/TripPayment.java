package com.swp391.koi_ordering_system.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "trip_payments")
public class TripPayment {
    @Id
    @Column(name = "id", nullable = false)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @Column(name = "create_at")
    private Instant createAt;

    @Column(name = "amount")
    private Double amount;

    @Column(name = "status")
    private Boolean status;

    @ColumnDefault("false")
    @Column(name = "is_deleted")
    private Boolean isDeleted;

}