package com.exampleKiitFinder.KittFinder.service;

import com.exampleKiitFinder.KittFinder.dto.ItemRequest;
import com.exampleKiitFinder.KittFinder.dto.ItemResponse;
import com.exampleKiitFinder.KittFinder.modell.Item;
import com.exampleKiitFinder.KittFinder.modell.User;

import java.util.List;

public interface ItemService {
    ItemResponse createItem(ItemRequest itemRequest, User postedBy);
    List<ItemResponse> getAllItems();
    ItemResponse getItemById(Long id);
    void deleteItem(Long id);
    List<ItemResponse> getItemsByUser(User user);
    ItemResponse updateItem(Long id, ItemRequest itemRequest, User currentUser);
    List<ItemResponse> getItemsByStatus(String status);
    List<ItemResponse> getItemsByCategory(String category);
    List<ItemResponse> searchItemsByLocation(String location);
}
