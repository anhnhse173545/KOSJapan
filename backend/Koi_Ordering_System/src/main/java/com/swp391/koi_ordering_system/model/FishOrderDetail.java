package com.swp391.koi_ordering_system.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import org.hibernate.annotations.ColumnDefault;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "fish_order_details")
public class FishOrderDetail {
    @Id
    @Column(name = "id", nullable = false, length = 9)

    private String id;

    @JsonBackReference(value = "fishOrder-fishOrderDetail")
    @ManyToOne(fetch = FetchType.EAGER, optional = true)
    @JoinColumn(name = "fish_order_id")
    private FishOrder fishOrder;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "fish_id", nullable = false)
    private Fish fish;

    @Column(name = "price")
    private Double price;

    @ColumnDefault("false")
    @Column(name = "is_deleted")
    private Boolean isDeleted = false;

}