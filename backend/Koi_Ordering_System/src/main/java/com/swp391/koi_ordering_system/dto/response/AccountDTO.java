package com.swp391.koi_ordering_system.dto.response;

import com.swp391.koi_ordering_system.model.Media;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AccountDTO {
    private String id;
    private String name;
    private String phone;
    private String email;
    private String role;
    private String address;
    private String mediaUrl;
}