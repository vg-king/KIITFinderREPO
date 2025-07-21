package com.exampleKiitFinder.KittFinder.service;

import com.exampleKiitFinder.KittFinder.modell.User;

import java.util.Optional;

public interface UserService {
    Optional<User> findByEmail(String email);
    User saveUser(User user);

    User getUserByEmail(String email); // ✅ Add this
}
