package com.swp391.koi_ordering_system.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "fishes")
public class Fish {
    @Id
    @Column(name = "id", nullable = false, length = 9)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "variety_id", nullable = false)
    private Variety variety;

    @Column(name = "length")
    private Double length;

    @Column(name = "weight")
    private Double weight;

    @Column(name = "description")
    private String description;

    @Column(name = "image")
    private String image;

    @ColumnDefault("false")
    @Column(name = "is_deleted")
    private Boolean isDeleted;

}