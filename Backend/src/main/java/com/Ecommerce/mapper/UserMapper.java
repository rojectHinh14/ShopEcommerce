package com.Ecommerce.mapper;

import com.Ecommerce.dto.response.UserResponse;
import com.Ecommerce.entity.Role;
import com.Ecommerce.entity.User;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Component
public class UserMapper {

    public UserResponse mapToUserResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setPhoneNumber(user.getPhoneNumber());

        Set<Role> rolesSet = user.getRoles();
        List<Role> rolesList = new ArrayList<>(rolesSet);
        response.setRole(rolesList);

        response.setEmailVerified(user.getEmailVerified());
        response.setPhoneVerified(user.getPhoneVerified());
        response.setCreatedAt(user.getCreatedAt());
        response.setLastName(user.getLastName());
        response.setFirstName(user.getFirstName());
        response.setDob(user.getDob());

        // ✅ Map avatar từ UserProfile nếu có
        if (user.getProfile() != null && user.getProfile().getAvatarUrl() != null) {
            response.setPathAvatar(user.getProfile().getAvatarUrl());
        }

        return response;
    }

}
