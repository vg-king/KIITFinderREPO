package com.exampleKiitFinder.KittFinder.controller;

import com.exampleKiitFinder.KittFinder.modell.User;
import com.exampleKiitFinder.KittFinder.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<User> getUserProfile() {
        // JWT filter already authenticated user
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        String email;
        if (principal instanceof UserDetails) {
            email = ((UserDetails) principal).getUsername(); // this is the email
        } else {
            email = principal.toString();
        }

        User user = userService.getUserByEmail(email);
        return ResponseEntity.ok(user);
    }
}
