package com.exampleKiitFinder.KittFinder.controller;

import com.exampleKiitFinder.KittFinder.Repo.ItemRepository;
import com.exampleKiitFinder.KittFinder.Repo.UserRepository;
import com.exampleKiitFinder.KittFinder.dto.ItemResponse;
import com.exampleKiitFinder.KittFinder.modell.Item;
import com.exampleKiitFinder.KittFinder.modell.User;
import com.exampleKiitFinder.KittFinder.service.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:8081")
@RequestMapping("/api/admin")
public class AdminController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ItemRepository itemRepository;
    
    @Autowired
    private ItemService itemService;
    
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers(){
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/items")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ItemResponse>> getAllItems(){
        List<ItemResponse> items = itemService.getAllItems();
        return ResponseEntity.ok(items);
    }
    
    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String > deleteUser(@PathVariable Long id){
        if (!userRepository.existsById(id)){
            return ResponseEntity.badRequest().body("User not found");
        }
        userRepository.deleteById(id);
        return ResponseEntity.ok("User deleted successfully");
    }
    
    @DeleteMapping("/item/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String > deleteItem(@PathVariable Long id){
        if (!itemRepository.existsById(id)){
            return ResponseEntity.badRequest().body("Item not found");

        }
        itemRepository.deleteById(id);
        return ResponseEntity.ok("Item deleted Successfully");
    }
    
    @GetMapping("/users/{userId}/items")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ItemResponse>> getUserItems(@PathVariable Long userId){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<ItemResponse> items = itemService.getItemsByUser(user);
        return ResponseEntity.ok(items);
    }
}
