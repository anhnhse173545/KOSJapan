package com.swp391.koi_ordering_system.model;

import jakarta.persistence.*;
import lombok.Cleanup;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "fish_payments")
public class FishPayment {
    @Id
    @Column(name = "id", nullable = false, length = 9)
    private String id;

    @OneToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "fish_order_id", nullable = false)
    private FishOrder fishOrder;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at")
    private LocalDateTime createAt;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "amount")
    private Double amount;

    @Column(name = "status")
    private String status;

    @ColumnDefault("false")
    @Column(name = "is_deleted")
    private Boolean isDeleted;

}