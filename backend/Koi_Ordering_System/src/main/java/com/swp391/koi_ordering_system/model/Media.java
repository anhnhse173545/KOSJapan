package com.swp391.koi_ordering_system.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "medias")
public class Media {

    @Id
    @Column(name = "id")
    private String id;

    @Column(name = "url")
    private String url;

    @Column(name = "type")
    private String type;

    @JsonBackReference(value = "fish-media")
    @ManyToMany(mappedBy = "medias")
    private Set<Fish> fishes;

    @JsonBackReference(value = "fishPack-media")
    @ManyToMany(mappedBy = "medias")
    private Set<FishPack> fishPacks;
}
