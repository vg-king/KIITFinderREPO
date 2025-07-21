package com.exampleKiitFinder.KittFinder.service;

import com.exampleKiitFinder.KittFinder.Repo.UserRepository;
import com.exampleKiitFinder.KittFinder.config.JwtUtil;
import com.exampleKiitFinder.KittFinder.dto.AuthResponse;
import com.exampleKiitFinder.KittFinder.dto.RegisterRequest;
import com.exampleKiitFinder.KittFinder.modell.Role;
import com.exampleKiitFinder.KittFinder.modell.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()){
            throw  new RuntimeException("Email already registered");
        }
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse("User registered successfully ",token);
    }
    public AuthResponse login(String email,String password){
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email,password)
            );
            String token = jwtUtil.generateToken(email);
            return new AuthResponse("Login successful",token);
        }catch (AuthenticationException ex){
            throw new RuntimeException("Invalid Credential");
        }
    }
}
