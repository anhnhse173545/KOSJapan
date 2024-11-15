package com.swp391.koi_ordering_system.dto.response;

import com.swp391.koi_ordering_system.model.Variety;
import jakarta.persistence.Column;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FishPackDTO {
    private String id;

    private String length;

    private String weight;

    private String description;

    private int quantity;

    private double price;

    private Variety variety;

    private String mediaUrl;
}
