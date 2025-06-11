package com.Ecommerce.controller;

import com.Ecommerce.dto.ApiResponse;
import com.Ecommerce.dto.PageResponse;
import com.Ecommerce.dto.request.AdminUpdateUserRequest;
import com.Ecommerce.dto.request.UserRegistrationRequest;
import com.Ecommerce.dto.response.UserResponse;
import com.Ecommerce.service.Impl.UserServiceImpl;
import com.Ecommerce.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users/admin")
public class AdminUserController {

    private final UserServiceImpl userService;
    public AdminUserController(UserServiceImpl userService) {
        this.userService = userService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PageResponse<UserResponse>>> getAllUsers(Pageable pageable) {
        Page<UserResponse> page = userService.getAllUsers(pageable);
        PageResponse<UserResponse> pageResponse = PageResponse.of(page);
        return ResponseEntity.ok(ApiResponse.success(pageResponse));
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PageResponse<UserResponse>>> searchUsers(
            @RequestParam("keyword") String keyword,
            Pageable pageable) {
        Page<UserResponse> page = userService.searchUsers(keyword, pageable);
        PageResponse<UserResponse> pageResponse = PageResponse.of(page);
        return ResponseEntity.ok(ApiResponse.success(pageResponse));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody AdminUpdateUserRequest request) {
        UserResponse updatedUser = userService.updateAdminUser(id, request);
        return ResponseEntity.ok(ApiResponse.success(updatedUser, "User updated successfully"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success(null, "User deleted successfully"));
    }
} 