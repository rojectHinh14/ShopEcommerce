package com.Ecommerce.controller;

import com.Ecommerce.dto.ApiResponse;
import com.Ecommerce.dto.PageResponse;
import com.Ecommerce.dto.request.*;
import com.Ecommerce.dto.response.UserResponse;
import com.Ecommerce.service.Impl.UserServiceImpl;
import com.Ecommerce.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserServiceImpl userService;
    public UserController(UserServiceImpl userService) {
        this.userService = userService;
    }

    // Đăng ký user
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> registerUser(
            @Validated @RequestBody UserRegistrationRequest request) {
        UserResponse userResponse = userService.registerUser(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(userResponse, "User registered successfully"));
    }

    @PostMapping("/create-password")
    public ApiResponse<Void> createPassword(@RequestBody @Valid PasswordCreationRequest request) {
        userService.createPassword(request);
        ApiResponse<Void> response = new ApiResponse<>();
        response.setSuccess(true); // nếu muốn đánh dấu thành công
        response.setMessage("Password has been created, you could use it to log-in");
        return response;
    }

    // Lấy user theo id
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable Long id) {
        UserResponse userResponse = userService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.success(userResponse));
    }

    // Lấy danh sách user phân trang(just admin)
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<UserResponse>>> getAllUsers(Pageable pageable) {
        Page<UserResponse> page = userService.getAllUsers(pageable);
        PageResponse<UserResponse> pageResponse = PageResponse.of(page);
        return ResponseEntity.ok(ApiResponse.success(pageResponse));
    }

    @PostMapping("/change-password")
    public ApiResponse<Void> changePassword(@RequestBody ChangePasswordRequest request) {
        userService.changePassword(request);
        return ApiResponse.success(null, "Password changed successfully");
    }
    @PutMapping("/profile")
    public ApiResponse<UserResponse> updateProfile(@RequestBody UpdateProfileRequest request) {
        UserResponse updated = userService.updateProfile(request);
        return ApiResponse.success(updated, "Profile updated successfully");
    }

    @GetMapping("/profile")
    public ApiResponse<UserResponse> getProfile() {
        UserResponse profile = userService.getCurrentUserProfile();
        return ApiResponse.success(profile);
    }

    // Tìm kiếm user theo từ khóa (query param ?q=keyword)
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PageResponse<UserResponse>>> searchUsers(
            @RequestParam("q") String keyword, Pageable pageable) {
        Page<UserResponse> page = userService.searchUsers(keyword, pageable);
        PageResponse<UserResponse> pageResponse = PageResponse.of(page);
        return ResponseEntity.ok(ApiResponse.success(pageResponse));
    }

    // Cập nhật user
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(
            @PathVariable Long id,
            @Validated @RequestBody UserRegistrationRequest request) {
        UserResponse updatedUser = userService.updateUser(id, request);
        return ResponseEntity.ok(ApiResponse.success(updatedUser, "User updated successfully"));
    }

    // Xóa user (soft delete) (just admin)
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success(null, "User deleted successfully"));
    }
}
