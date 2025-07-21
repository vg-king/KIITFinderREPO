package com.exampleKiitFinder.KittFinder.modell;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "items")
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 1000)
    private String description;
    private String imageUrl;

    private String location;
    @Column(name = "reward")
    private Double reward;
    private String status;
    private boolean approved = false;
    private LocalDateTime reportedAt = LocalDateTime.now();
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String category;
    
    @ManyToOne
    @JoinColumn(name = "reported_by")
    private User reportedBy;
    
    @ManyToOne
    @JoinColumn(name = "posted_by")
    private User postedBy;
    
    public Item(){}

    public Item(Long id, String title, String description, String imageUrl, String location, String status, boolean approved, LocalDateTime reportedAt, User reportedBy, Double reward, LocalDateTime createdAt, LocalDateTime updatedAt, String category, User postedBy) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.imageUrl = imageUrl;
        this.location = location;
        this.status = status;
        this.approved = approved;
        this.reportedAt = reportedAt;
        this.reportedBy = reportedBy;
        this.reward = reward;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.category = category;
        this.postedBy = postedBy;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public boolean isApproved() {
        return approved;
    }

    public void setApproved(boolean approved) {
        this.approved = approved;
    }

    public LocalDateTime getReportedAt() {
        return reportedAt;
    }

    public void setReportedAt(LocalDateTime reportedAt) {
        this.reportedAt = reportedAt;
    }

    public User getReportedBy() {
        return reportedBy;
    }

    public void setReportedBy(User reportedBy) {
        this.reportedBy = reportedBy;
    }

    public Double getReward() {
        return reward;
    }

    public void setReward(Double reward) {
        this.reward = reward;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public User getPostedBy() {
        return postedBy;
    }

    public void setPostedBy(User postedBy) {
        this.postedBy = postedBy;
    }
}
