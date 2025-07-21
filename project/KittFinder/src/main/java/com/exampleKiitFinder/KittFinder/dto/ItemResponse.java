package com.exampleKiitFinder.KittFinder.dto;

public class ItemResponse {
    private Long id;
    private String name;
    private String description;
    private String location;
    private String category;
    private String imageUrl;
    private String createAt;
    private String updatedAt;
    private Double reward;
    private String postedByName;
    private Long postedById;
    
    public ItemResponse(){}

    public ItemResponse(Long id, String name, String description, String location, String category, String imageUrl, String createAt, String updatedAt, Double reward, String postedByName, Long postedById) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.location = location;
        this.category = category;
        this.imageUrl = imageUrl;
        this.createAt = createAt;
        this.updatedAt = updatedAt;
        this.reward = reward;
        this.postedByName = postedByName;
        this.postedById = postedById;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getCreateAt() {
        return createAt;
    }

    public void setCreateAt(String createAt) {
        this.createAt = createAt;
    }

    public String getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Double getReward() {
        return reward;
    }

    public void setReward(Double reward) {
        this.reward = reward;
    }

    public String getPostedByName() {
        return postedByName;
    }

    public void setPostedByName(String postedByName) {
        this.postedByName = postedByName;
    }

    public Long getPostedById() {
        return postedById;
    }

    public void setPostedById(Long postedById) {
        this.postedById = postedById;
    }
}
