package com.exampleKiitFinder.KittFinder.controller;

import com.exampleKiitFinder.KittFinder.Repo.UserRepository;
import com.exampleKiitFinder.KittFinder.dto.AuthResponse;
import com.exampleKiitFinder.KittFinder.dto.RegisterRequest;
import com.exampleKiitFinder.KittFinder.modell.Role;
import com.exampleKiitFinder.KittFinder.modell.User;
import com.exampleKiitFinder.KittFinder.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:8081")
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody RegisterRequest request) {
        AuthResponse response = authService.login(request.getEmail(), request.getPassword());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/create-admin")
    public ResponseEntity<String> createAdmin() {
        if (userRepository.findByEmail("admin@kiit.com").isPresent()) {
            return ResponseEntity.badRequest().body("Admin user already exists");
        }

        User admin = new User();
        admin.setName("Super Admin");
        admin.setEmail("admin@kiit.com");
        admin.setPassword(passwordEncoder.encode("admin123")); // make sure passwordEncoder is injected
        admin.setRole(Role.ADMIN); // Assuming Role is an enum

        userRepository.save(admin);
        return ResponseEntity.ok("Admin user created successfully");
    }


}
