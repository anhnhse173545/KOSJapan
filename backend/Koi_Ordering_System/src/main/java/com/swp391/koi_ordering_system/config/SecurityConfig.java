package com.swp391.koi_ordering_system.config;
import com.swp391.koi_ordering_system.jwt.JwtAuthenticationFIlter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
//@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFIlter jwtAuthenticationFIlter;
//Permit All
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
               .csrf().disable() // Disable CSRF
                .authorizeRequests()
                .anyRequest().permitAll(); // Allow all requests without authentication

        return http.build();

    }

//    @Bean
//     public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//         http
//                 .cors(cors -> cors.disable())
//                 .authorizeHttpRequests(authorize -> authorize
//                         .requestMatchers("/api/auth/**").permitAll()
//                         .requestMatchers("/forgot-password/**").permitAll()
//                         .requestMatchers("/swagger-ui/**").permitAll()
//                         .requestMatchers("/swagger-ui.html").permitAll()
//                         .requestMatchers("/v3/api-docs/**").permitAll()
//                         .anyRequest().authenticated()
//                 )
//                 .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
//                 .csrf(csrf -> csrf.disable())
//                 .addFilterBefore(jwtAuthenticationFIlter, UsernamePasswordAuthenticationFilter.class);
//         return http.build();
//     }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return NoOpPasswordEncoder.getInstance();
    }
}