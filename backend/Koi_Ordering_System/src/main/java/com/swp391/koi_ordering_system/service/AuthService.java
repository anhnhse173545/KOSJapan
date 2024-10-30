package com.swp391.koi_ordering_system.service;

import com.swp391.koi_ordering_system.dto.request.ForgetPasswordDTO;
import com.swp391.koi_ordering_system.dto.request.LoginRequestDTO;
import com.swp391.koi_ordering_system.dto.request.RegisterRequestDTO;
import com.swp391.koi_ordering_system.dto.request.TokenRefreshRequestDTO;
import com.swp391.koi_ordering_system.dto.response.AccountDTO;
import com.swp391.koi_ordering_system.dto.response.TokenRefreshResponseDTO;
import com.swp391.koi_ordering_system.jwt.JwtTokenProvider;
import com.swp391.koi_ordering_system.mapper.AccountMapper;
import com.swp391.koi_ordering_system.model.Account;
import com.swp391.koi_ordering_system.model.Booking;
import com.swp391.koi_ordering_system.repository.AccountRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Collection;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private AccountMapper accountMapper;

    public TokenRefreshResponseDTO authenticateUser(LoginRequestDTO loginRequestDTO) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequestDTO.getPhone(), loginRequestDTO.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String accessToken = jwtTokenProvider.generateToken(authentication);
        String refreshToken = jwtTokenProvider.generateRefreshToken(authentication);

        Account account = accountRepository.findByPhone(loginRequestDTO.getPhone());
        String role = account.getRole();

        return new TokenRefreshResponseDTO(accessToken, refreshToken, role);
    }

    public void registerUser(RegisterRequestDTO registerRequestDTO) {
        boolean isManager = isRole("ROLE_MANAGER");

        Account account = new Account();
        account.setId(generateAccountId());
        if (registerRequestDTO.getPhone() == null) {
            throw new RuntimeException("Phone number is required");
        }
        else if (accountRepository.findByPhone(registerRequestDTO.getPhone()) != null) {
            throw new RuntimeException("Phone number already exists");
        }
        account.setPhone(registerRequestDTO.getPhone());
        if (registerRequestDTO.getPassword() == null) {
            throw new RuntimeException("Password is required");
        }
        account.setPassword(registerRequestDTO.getPassword());
        account.setName(registerRequestDTO.getName());
        if (accountRepository.findByEmail(registerRequestDTO.getEmail()) != null) {
            throw new RuntimeException("Email already exists");
        }
        account.setEmail(registerRequestDTO.getEmail());
        account.setAddress(registerRequestDTO.getAddress());
        if (!isManager || registerRequestDTO.getRole() == null) {
            account.setRole("Customer");
        } else {
            account.setRole(registerRequestDTO.getRole());
        }
        accountRepository.save(account);
    }

    public String getPassword(ForgetPasswordDTO forgetPasswordDTO) {
        Account account = accountRepository.findByPhone(forgetPasswordDTO.getPhone());
        if (account == null) {
            throw new EntityNotFoundException("Account not found");
        }
        account.setPassword(forgetPasswordDTO.getPassword());
        return account.getPassword();
    }

    public TokenRefreshResponseDTO refreshToken(TokenRefreshRequestDTO request) {
        String refreshToken = request.getRefreshToken();
        if (jwtTokenProvider.validateToken(refreshToken)) {
            String username = jwtTokenProvider.getUsernameFromToken(refreshToken);
            Authentication authentication = getAuthentication(username);
            String newToken = jwtTokenProvider.generateToken(authentication);

            Account account = accountRepository.findByPhone(username);
            String role = account.getRole();

            return new TokenRefreshResponseDTO(newToken, refreshToken, role);
        } else {
            throw new IllegalArgumentException("Invalid refresh token");
        }
    }
    private Authentication getAuthentication(String phone) {
        Account account = accountRepository.findByPhone(phone);
        return new UsernamePasswordAuthenticationToken(account, null, account.getAuthorities());
    }

    public boolean isRole(String role) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        return authorities.stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals(role));
    }


    private String generateAccountId() {
        String lastAccountId = accountRepository.findTopByOrderByIdDesc()
                .map(Account::getId)
                .orElse("AC0000");
        int nextId = Integer.parseInt(lastAccountId.substring(2)) + 1;
        return String.format("AC%04d", nextId);
    }
}
