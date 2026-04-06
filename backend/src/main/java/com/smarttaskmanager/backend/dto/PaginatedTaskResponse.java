package com.smarttaskmanager.backend.dto;

import java.util.List;

public class PaginatedTaskResponse {

    private List<TaskResponse> content;
    private int totalPages;
    private long totalElements;

    public PaginatedTaskResponse(List<TaskResponse> content, int totalPages, long totalElements) {
        this.content = content;
        this.totalPages = totalPages;
        this.totalElements = totalElements;
    }

    public List<TaskResponse> getContent() {
        return content;
    }

    public void setContent(List<TaskResponse> content) {
        this.content = content;
    }

    public int getTotalPages() {
        return totalPages;
    }

    public void setTotalPages(int totalPages) {
        this.totalPages = totalPages;
    }

    public long getTotalElements() {
        return totalElements;
    }

    public void setTotalElements(long totalElements) {
        this.totalElements = totalElements;
    }
}
