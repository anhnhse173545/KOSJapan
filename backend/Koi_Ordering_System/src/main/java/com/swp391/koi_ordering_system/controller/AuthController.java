package com.swp391.koi_ordering_system.controller;

import com.swp391.koi_ordering_system.dto.request.*;
import com.swp391.koi_ordering_system.dto.response.AccountDTO;
import com.swp391.koi_ordering_system.dto.response.TokenRefreshResponseDTO;
import com.swp391.koi_ordering_system.jwt.JwtTokenProvider;
import com.swp391.koi_ordering_system.mapper.AccountMapper;
import com.swp391.koi_ordering_system.model.Account;
import com.swp391.koi_ordering_system.service.AccountService;
import com.swp391.koi_ordering_system.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private AuthService authService;

    @Autowired
    private AccountService accountService;

    @Autowired
    private AccountMapper accountMapper;

    @PostMapping("/login")
    public ResponseEntity<TokenRefreshResponseDTO> authenticateUser(@Valid @RequestBody LoginRequestDTO loginRequest) {
        TokenRefreshResponseDTO response = authService.authenticateUser(loginRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@Valid @RequestBody RegisterRequestDTO registerRequest) {
        authService.registerUser(registerRequest);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Registration successful");
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<TokenRefreshResponseDTO> refreshToken(@RequestBody TokenRefreshRequestDTO request) {
        TokenRefreshResponseDTO response = authService.refreshToken(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<AccountDTO> getCurrentUser(Authentication authentication) {
        Account account = accountService.getAccountByPhone(authentication.getName());
        AccountDTO accountDTO = accountMapper.toDTO(account);
        return ResponseEntity.ok(accountDTO);
    }
    
    @PostMapping("/update-password")
    public ResponseEntity<String> updatePassword(@Valid @RequestBody UpdatePasswordDTO updatePasswordDTO) {
        authService.updatePassword(updatePasswordDTO);
        return ResponseEntity.ok("Password updated successfully");
    }

    @PostMapping("/forget-password")
    public ResponseEntity<String> forgetPassword(@Valid @RequestBody ForgetPasswordDTO forgetPasswordDTO) {
        authService.forgotPassword(forgetPasswordDTO);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordDTO resetPasswordDTO) {
        authService.resetPassword(resetPasswordDTO.getResetToken(), resetPasswordDTO.getNewPassword());
        return ResponseEntity.ok("Password reset successfully");
    }
}
