package com.Ecommerce.dto.request.Category;

import jakarta.validation.constraints.NotBlank;

public class CategoryRequest {
    @NotBlank(message = "Name is required")
    private String name;
    private String description;
    private Integer sortOrder;

    // getters, setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Integer getSortOrder() { return sortOrder; }
    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }


}
