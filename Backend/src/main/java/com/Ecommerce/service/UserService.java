package com.Ecommerce.service;

import com.Ecommerce.dto.request.ChangePasswordRequest;
import com.Ecommerce.dto.request.LoginRequest;
import com.Ecommerce.dto.request.UpdateProfileRequest;
import com.Ecommerce.dto.request.UserRegistrationRequest;
import com.Ecommerce.dto.response.UserResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {

    UserResponse registerUser(UserRegistrationRequest request);
    UserResponse getUserById(Long id);
    Page<UserResponse> getAllUsers(Pageable pageable);
    Page<UserResponse> searchUsers(String keyword, Pageable pageable);
    UserResponse updateUser(Long id, UserRegistrationRequest request);
    void deleteUser(Long id);
    void changePassword(ChangePasswordRequest request);
    UserResponse updateProfile(UpdateProfileRequest request);
    UserResponse getCurrentUserProfile();
}
