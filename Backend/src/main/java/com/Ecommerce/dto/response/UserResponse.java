package com.Ecommerce.dto.response;

import com.Ecommerce.entity.Role;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;


public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String phoneNumber;
    private List<Role> role;
    private Boolean emailVerified;
    private Boolean phoneVerified;
    private LocalDateTime createdAt;
    String firstName;
    String lastName;
    LocalDate dob;
    String pathAvatar;

    String file;
    public UserResponse() {}

    public UserResponse(String file , Long id, String username, String email, String phoneNumber, List<Role> role, Boolean emailVerified, Boolean phoneVerified,String pathAvatar, LocalDateTime createdAt, String firstName, String lastName, LocalDate dob) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.role = role;
        this.emailVerified = emailVerified;
        this.phoneVerified = phoneVerified;
        this.createdAt = createdAt;
        this.firstName = firstName;
        this.lastName = lastName;
        this.dob = dob;
        this.pathAvatar = pathAvatar;
        this.file = file;
    }

    public Long getId() {
        return id;
    }

    public String getPathAvatar() {
        return pathAvatar;
    }

    public void setPathAvatar(String pathAvatar) {
        this.pathAvatar = pathAvatar;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFile() {
        return file;
    }

    public void setFile(String file) {
        this.file = file;
    }

    public LocalDate getDob() {
        return dob;
    }

    public void setDob(LocalDate dob) {
        this.dob = dob;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Boolean getPhoneVerified() {
        return phoneVerified;
    }

    public void setPhoneVerified(Boolean phoneVerified) {
        this.phoneVerified = phoneVerified;
    }

    public Boolean getEmailVerified() {
        return emailVerified;
    }

    public void setEmailVerified(Boolean emailVerified) {
        this.emailVerified = emailVerified;
    }

    public List<Role> getRole() {
        return role;
    }

    public void setRole(List<Role> role) {
        this.role = role;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}