package com.swp391.koi_ordering_system.service;

import com.swp391.koi_ordering_system.dto.request.LoginRequestDTO;
import com.swp391.koi_ordering_system.dto.request.RegisterRequestDTO;
import com.swp391.koi_ordering_system.dto.request.TokenRefreshRequestDTO;
import com.swp391.koi_ordering_system.dto.response.TokenRefreshResponseDTO;
import com.swp391.koi_ordering_system.jwt.JwtTokenProvider;
import com.swp391.koi_ordering_system.model.Account;
import com.swp391.koi_ordering_system.model.Booking;
import com.swp391.koi_ordering_system.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private AccountRepository accountRepository;

    public TokenRefreshResponseDTO authenticateUser(LoginRequestDTO loginRequestDTO) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequestDTO.getPhone(), loginRequestDTO.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String accessToken = jwtTokenProvider.generateToken(authentication);
        String refreshToken = jwtTokenProvider.generateRefreshToken(authentication);
        return new TokenRefreshResponseDTO(accessToken, refreshToken);
    }

    public void registerUser(RegisterRequestDTO registerRequestDTO) {
        if (accountRepository.findByPhone(registerRequestDTO.getPhone()) != null) {
            throw new IllegalArgumentException("Phone number already exists");
        }
        Account account = new Account();
        account.setId(generateAccountId());
        account.setPhone(registerRequestDTO.getPhone());
        account.setPassword(registerRequestDTO.getPassword());
        account.setName(registerRequestDTO.getName());
        account.setEmail(registerRequestDTO.getEmail());
        account.setAddress(registerRequestDTO.getAddress());
        account.setRole(registerRequestDTO.getRole());

        accountRepository.save(account);
    }

    public TokenRefreshResponseDTO refreshToken(TokenRefreshRequestDTO request) {
        String refreshToken = request.getRefreshToken();
        if (jwtTokenProvider.validateToken(refreshToken)) {
            String username = jwtTokenProvider.getUsernameFromToken(refreshToken);
            Authentication authentication = getAuthentication(username);
            String newToken = jwtTokenProvider.generateToken(authentication);
            return new TokenRefreshResponseDTO(newToken, refreshToken);
        } else {
            throw new IllegalArgumentException("Invalid refresh token");
        }
    }

    private Authentication getAuthentication(String username) {
        Account account = accountRepository.findByPhone(username);
        return new UsernamePasswordAuthenticationToken(account, null, account.getAuthorities());
    }

    private String generateAccountId() {
        String lastAccountId = accountRepository.findTopByOrderByIdDesc()
                .map(Account::getId)
                .orElse("AC0000");
        int nextId = Integer.parseInt(lastAccountId.substring(2)) + 1;
        return String.format("AC%04d", nextId);
    }
}
