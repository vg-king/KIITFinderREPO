package com.exampleKiitFinder.KittFinder.dto;

public class UpdateItemStatusDto {
    private Long itemId;
    private String status;

    public UpdateItemStatusDto(){}

    public UpdateItemStatusDto(Long itemId, String status) {
        this.itemId = itemId;
        this.status = status;
    }

    public Long getItemId() {
        return itemId;
    }

    public void setItemId(Long itemId) {
        this.itemId = itemId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
