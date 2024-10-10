package com.swp391.koi_ordering_system.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "trip_payments")
public class TripPayment {
    @Id
    @Column(name = "id", nullable = false)
    private String id;

    @JsonBackReference(value = "booking-tripPayment")
    @OneToOne
    @JoinColumn(name = "booking_id")
    private Booking booking;

    @ManyToOne
    @JoinColumn(name = "payment_method_id")
    private PaymentMethod paymentMethod;

    @CreationTimestamp
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