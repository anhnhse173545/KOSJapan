//package com.swp391.koi_ordering_system.controller;
//
//import com.swp391.koi_ordering_system.dto.request.LoginRequest;
//import com.swp391.koi_ordering_system.model.Account;
//import com.swp391.koi_ordering_system.repository.AccountRepository;
//import com.swp391.koi_ordering_system.service.UserDetailsService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.AuthenticationException;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.Comparator;
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/auth")
//public class AuthController {
//
//    @Autowired
//    private AccountRepository accountRepository;
//
//    @Autowired
//    private JwtUtil jwtUtil;
//
//    @Autowired
//    private UserDetailsService userDetailsService;
//    @Autowired
//    private AuthenticationManager authenticationManager;
//
//
//    @PostMapping("/login")
//    public String login(@RequestBody LoginRequest loginRequest) {
//        try {
//            Authentication authentication = authenticationManager.authenticate(
//                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
//            );
//
//            UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getUsername());
//            String token = jwtUtil.generateToken(userDetails);
//            return "Login successful. Token: " + token;
//        } catch (AuthenticationException e) {
//            return "Login failed: " + e.getMessage();
//        }
//    }
//    @PostMapping("/register")
//    public String registerUser(@RequestBody Account account) {
//        account.setId(generateId());
//        account.setPassword(new BCryptPasswordEncoder().encode(account.getPassword()));
//        accountRepository.save(account);
//        UserDetails userDetails = userDetailsService.loadUserByUsername(account.getPhone());
//        String token = jwtUtil.generateToken(userDetails);
//        return "User registered successfully. Token: " + token;
//    }
//
//    private String generateId() {
//        List<Account> accounts = accountRepository.findAll();
//        String maxId = accounts.stream()
//                .map(Account::getId)
//                .filter(id -> id.startsWith("AC"))
//                .max(Comparator.comparingInt(id -> Integer.parseInt(id.substring(2))))
//                .orElse("AC0000");
//
//        int newIdNum = Integer.parseInt(maxId.substring(2)) + 1;
//        return "AC" + String.format("%04d", newIdNum);
//    }
//}