package com.exampleKiitFinder.KittFinder.dto;

public class ItemRequest {
    private String title;
    private String description;
    private String location;
    private String category;
    private String status;
    private Double reward;

public ItemRequest(){}

    public ItemRequest(String title, String description, String location, String category, String status, Double reward) {
        this.title = title;
        this.description = description;
        this.location = location;
        this.category = category;
        this.status = status;
        this.reward = reward;
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

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Double getReward() {
        return reward;
    }

    public void setReward(Double reward) {
        this.reward = reward;
    }
}
