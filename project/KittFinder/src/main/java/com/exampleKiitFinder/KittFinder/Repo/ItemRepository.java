package com.exampleKiitFinder.KittFinder.Repo;

import com.exampleKiitFinder.KittFinder.modell.Item;
import com.exampleKiitFinder.KittFinder.modell.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface ItemRepository extends JpaRepository<Item,Long> {
    List<Item> findByApprovedTrue();
    List<Item> findByReportedBy(User user);
    List<Item> findByPostedBy(User user);
    List<Item> findByStatus(String status);
    List<Item> findByCategory(String category);
    List<Item> findByLocationContainingIgnoreCase(String location);
}
