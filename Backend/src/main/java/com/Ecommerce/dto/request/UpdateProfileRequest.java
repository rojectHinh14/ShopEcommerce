package com.Ecommerce.dto.request;

import com.Ecommerce.entity.UserProfile;

import java.time.LocalDate;

public class UpdateProfileRequest {
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private UserProfile.Gender gender;
    private String avatarUrl;
    private String avatarBase64;


    public String getFirstName() {
        return firstName;
    }


    public String getAvatarBase64() {
        return avatarBase64;
    }

    public void setAvatarBase64(String avatarBase64) {
        this.avatarBase64 = avatarBase64;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public UserProfile.Gender getGender() {
        return gender;
    }

    public void setGender(UserProfile.Gender gender) {
        this.gender = gender;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }
}
