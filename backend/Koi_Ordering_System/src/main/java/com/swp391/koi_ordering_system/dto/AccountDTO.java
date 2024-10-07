package com.swp391.koi_ordering_system.dto;

import jakarta.persistence.Column;
import jakarta.persistence.Id;
import lombok.Builder;
import lombok.Data;
import org.hibernate.annotations.ColumnDefault;

@Data
@Builder
public class AccountDTO {
    // Khong co bank_account_id, is_delete, profile_img bi lap lai
    @Id
    @Column(name = "id", nullable = false)
    private String id;

    @Column(name = "username", nullable = false)
    private String username;

//    @Column(name = "password", nullable = false)
//    private String password;

    @Column(name = "name")
    private String name;

    @Column(name = "role")
    private String role;

    @Column(name = "phone")
    private String phone;

    @Column(name = "address")
    private String address;

    @Column(name = "profile_image")
    private String profileImage;
}
