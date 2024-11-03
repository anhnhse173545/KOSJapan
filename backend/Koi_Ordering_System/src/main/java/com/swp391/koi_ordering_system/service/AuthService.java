package com.swp391.koi_ordering_system.service;

import com.swp391.koi_ordering_system.dto.request.*;
import com.swp391.koi_ordering_system.dto.response.AccountDTO;
import com.swp391.koi_ordering_system.dto.response.TokenRefreshResponseDTO;
import com.swp391.koi_ordering_system.jwt.JwtTokenProvider;
import com.swp391.koi_ordering_system.mapper.AccountMapper;
import com.swp391.koi_ordering_system.model.Account;
import com.swp391.koi_ordering_system.model.Booking;
import com.swp391.koi_ordering_system.repository.AccountRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Optional;
import java.util.UUID;

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

    @Autowired
    JavaMailSender javaMailSender;


    public TokenRefreshResponseDTO authenticateUser(@Valid LoginRequestDTO loginRequestDTO) {
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

    public void registerUser(@Valid RegisterRequestDTO registerRequestDTO) {
        boolean isManager = isRole("ROLE_MANAGER");

        Account account = new Account();
        account.setId(generateAccountId());
        if (registerRequestDTO.getPhone() == null) {
            throw new RuntimeException("Phone number is required");
        } else if (accountRepository.findByPhone(registerRequestDTO.getPhone()) != null) {
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

    public String getPassword(@Valid ForgetPasswordDTO forgetPasswordDTO) {
        Account account = accountRepository.findByPhone(forgetPasswordDTO.getPhone());
        if (account == null) {
            throw new EntityNotFoundException("Account not found");
        }
        account.setPassword(forgetPasswordDTO.getPassword());
        accountRepository.save(account);
        return account.getPassword();
    }

    public void forgotPassword(ForgetPasswordDTO forgetPasswordDTO) {
        Account account = accountRepository.findByPhone(forgetPasswordDTO.getPhone());
        if (account == null) {
            throw new EntityNotFoundException("Account not found");
        }
        String newPassword = forgetPasswordDTO.getPassword();

        String token = UUID.randomUUID().toString();
        LocalDateTime expiration = LocalDateTime.now().plusMinutes(30);

        account.setResetToken(token);
        account.setResetTokenExpiration(expiration);
        accountRepository.save(account);

        sendResetPasswordEmail(account.getEmail(), token, newPassword);
    }

    private void sendResetPasswordEmail(String email, String token, String newPassword) {
        try {
            String resetLink = "http://localhost:8080/api/auth/reset-password?token=" + token + "&newPassword=" + newPassword;
            String htmlContent = "<html>" +
                    "<head>" +
                    "<style>" +
                    "body { font-family: Arial, sans-serif; background-color: #fafafa; margin: 0; padding: 0; }" + 
                    ".container { max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); }" + // Added border
                    ".header { background-color: #4A90E2; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }" +
                    ".header h2 { margin: 0; }" +
                    ".content { padding: 20px; }" +
                    ".button { display: inline-block; background-color: #4A90E2; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; }" +
                    ".footer { margin-top: 20px; font-size: 12px; color: #777; text-align: center; }" +
                    "</style>" +
                    "</head>" +
                    "<body>" +
                    "<div class='container'>" +
                    "<div class='header'>" +
                    "<h2>Reset Password Confirmation</h2>" +
                    "</div>" +
                    "<div class='content'>" +
                    "<p>Hello,</p>" +
                    "<p>We have sent you this email in response to your request to reset your password on our site.</p>" +
                    "<p>To reset your password, please follow the link below:</p>" +
                    "<a href='" + resetLink + "' class='button'>Reset Password</a>" +
                    "</div>" +
                    "<div class='footer'>" +
                    "<p>Please ignore this email if you did not request a password change.</p>" +
                    "</div>" +
                    "</div>" +
                    "</body>" +
                    "</html>";

            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(email);
            helper.setSubject("Password Reset Request");
            helper.setText(htmlContent, true);

            javaMailSender.send(message);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    public void resetPassword(String token, String newPassword) {
        Optional<Account> account = accountRepository.findByResetToken(token);
        if (account.isEmpty()) {
            throw new EntityNotFoundException("Invalid token");
        }
        if (account.get().getResetTokenExpiration().isBefore(LocalDateTime.now()) || account.get().getResetTokenExpiration() == null) {
            throw new IllegalArgumentException("Token has expired");
        }
        account.get().setPassword(newPassword);
        account.get().setResetToken(null);
        account.get().setResetTokenExpiration(null);
        accountRepository.save(account.get());
    }

    public void updatePassword(UpdatePasswordDTO updatePasswordDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new SecurityException("User is not logged in");
        }
        String phone = authentication.getName();
        Account account = accountRepository.findByPhone(phone);

        if (!account.getPassword().equals(updatePasswordDTO.getOldPassword())) {
            throw new IllegalArgumentException("Old password is incorrect");
        }

        account.setPassword(updatePasswordDTO.getNewPassword());
        accountRepository.save(account);
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
