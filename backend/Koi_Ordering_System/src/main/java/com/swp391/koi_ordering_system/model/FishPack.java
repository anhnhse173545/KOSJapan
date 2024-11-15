package com.swp391.koi_ordering_system.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "fish_packs")
public class FishPack {
    @Id
    @Column(name = "id")
    private String id;

    @Column(name = "length")
    private String length;

    @Column(name = "weight")
    private String weight;

    @Column(name = "description")
    private String description;

    @Column(name = "quantity")
    private Integer quantity;

    @ColumnDefault("false")
    @Column(name = "is_deleted")
    private Boolean isDeleted;

    @ManyToOne
    @JoinColumn(name = "variety_id")
    private Variety variety;

    @ManyToOne
    @JoinColumn(name = "media_id")
    private Media image;
}