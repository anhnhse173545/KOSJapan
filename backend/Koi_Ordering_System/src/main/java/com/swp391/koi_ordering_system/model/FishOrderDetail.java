package com.swp391.koi_ordering_system.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

@Getter
@Setter
@Entity
@Table(name = "fish_order_details")
public class FishOrderDetail {
    @Id
    @Column(name = "id", nullable = false, length = 9)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;

    @JsonBackReference(value = "fishOrder-fishOrderDetail")
    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "fish_order_id", nullable = true)
    private FishOrder fishOrder;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "fish_id", nullable = false)
    private Fish fish;

    @Column(name = "price")
    private Double price;

    @ColumnDefault("false")
    @Column(name = "is_deleted")
    private Boolean isDeleted;

}