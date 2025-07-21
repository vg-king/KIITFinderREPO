package com.exampleKiitFinder.KittFinder.service;

import com.exampleKiitFinder.KittFinder.Repo.ItemRepository;
import com.exampleKiitFinder.KittFinder.dto.ItemRequest;
import com.exampleKiitFinder.KittFinder.dto.ItemResponse;
import com.exampleKiitFinder.KittFinder.modell.Item;
import com.exampleKiitFinder.KittFinder.modell.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service

public class ItemServiceImpl implements ItemService {
    @Autowired
    private ItemRepository itemRepository;

    public ItemResponse createItem(ItemRequest itemRequest, User postedBy){
        Item item = new Item();
        item.setTitle(itemRequest.getTitle());

        item.setDescription(itemRequest.getDescription());
        item.setLocation(itemRequest.getLocation());
        item.setCategory(itemRequest.getCategory());
        item.setStatus(itemRequest.getStatus());
        item.setReward(itemRequest.getReward());
        item.setPostedBy(postedBy);
        item.setApproved(false); // New items need approval
        item.setCreatedAt(LocalDateTime.now());
        item.setUpdatedAt(LocalDateTime.now());

        Item saved = itemRepository.save(item);
        return mapToResponse(saved);

    }

    @Override
    public List<ItemResponse> getAllItems() {
        return itemRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ItemResponse getItemById(Long id) {
        Item item = itemRepository.findById(id)
                .orElseThrow(()->new RuntimeException("Item not found with id: "+id));
        return mapToResponse(item);
    }

    @Override
    public void deleteItem(Long id) {
        if (!itemRepository.existsById(id)) {
            throw new RuntimeException("Item not found with id: " + id);
        }
        itemRepository.deleteById(id);
    }

    @Override
    public List<ItemResponse> getItemsByUser(User user) {
        return itemRepository.findByPostedBy(user).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ItemResponse> getItemsByStatus(String status) {
        return itemRepository.findByStatus(status).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ItemResponse> getItemsByCategory(String category) {
        return itemRepository.findByCategory(category).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ItemResponse> searchItemsByLocation(String location) {
        return itemRepository.findByLocationContainingIgnoreCase(location).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private ItemResponse mapToResponse(Item item){
        return new ItemResponse(
                item.getId(),
                item.getTitle(),
                item.getDescription(),
                item.getLocation(),
                item.getCategory(),
                item.getImageUrl(),
                item.getCreatedAt() != null ? item.getCreatedAt().toString() : null,
                item.getUpdatedAt() != null ? item.getUpdatedAt().toString() : null,
                item.getReward(),
                item.getPostedBy() != null ? item.getPostedBy().getName() : null,
                item.getPostedBy() != null ? item.getPostedBy().getId() : null
        );
    }

    public ItemResponse updateItem(Long id, ItemRequest itemRequest, User currentUser) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found with id: " + id));

        // Only allow the owner or admin to update
        if (!item.getPostedBy().getId().equals(currentUser.getId()) &&
                !currentUser.getRole().name().equals("ADMIN")) {
            throw new RuntimeException("You don't have permission to update this item");
        }

        item.setTitle(itemRequest.getTitle());
        item.setDescription(itemRequest.getDescription());
        item.setLocation(itemRequest.getLocation());
        item.setCategory(itemRequest.getCategory());
        item.setStatus(itemRequest.getStatus());
        item.setReward(itemRequest.getReward());
        item.setUpdatedAt(LocalDateTime.now());

        Item updated = itemRepository.save(item);
        return mapToResponse(updated);
    }
}