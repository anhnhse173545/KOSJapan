package com.swp391.koi_ordering_system.dto;

import jakarta.persistence.Column;
import jakarta.persistence.Id;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;


@Builder
@Getter
@Setter
public class AccountDTO {
    // Khong co bank_account_id, is_delete, profile_img bi lap lai
    @Id
    private String id;
    private String username;
//    @Column(name = "password", nullable = false)
//    private String password;
    private String name;
    private String role;
    private String phone;
    private String address;
    private String profileImage;
}
