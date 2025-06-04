package com.Ecommerce.service.Impl;

import com.Ecommerce.dto.request.*;
import com.Ecommerce.dto.response.UserResponse;
import com.Ecommerce.entity.Role;
import com.Ecommerce.entity.User;
import com.Ecommerce.entity.UserProfile;
import com.Ecommerce.exception.ConflictException;
import com.Ecommerce.exception.ResourceNotFoundException;
import com.Ecommerce.mapper.UserMapper;
import com.Ecommerce.repository.RoleRepository;
import com.Ecommerce.repository.UserProfileRepository;
import com.Ecommerce.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.Ecommerce.exception.UnauthorizedException;
import com.Ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Set;

@Service
@Transactional
public class UserServiceImpl  implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final RoleRepository roleRepository;
    private final UserProfileRepository userProfileRepository;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, UserMapper userMapper, RoleRepository roleRepository, UserProfileRepository userProfileRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userMapper = userMapper;
        this.roleRepository = roleRepository;
        this.userProfileRepository = userProfileRepository;
    }

    @Value("${storage.avatar.relative.path}")
    private String avatarRelativePath;

    @Value("${storage.root.folder.avatar}")
    private String rootFolderAvatar;

    @Value("${storage.root.folder.product}")
    private String rootFolderProduct;

    @Override
    public UserResponse registerUser(UserRegistrationRequest request)  {
        // Check tồn tại email, username ...

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());

        // Gán role mặc định
        Role defaultRole = roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new RuntimeException("Default role not found"));
        user.setRoles(Set.of(defaultRole));

        user.setCreatedAt(LocalDateTime.now());

        user = userRepository.save(user);
        return userMapper.mapToUserResponse(user);
    }


    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return userMapper.mapToUserResponse(user);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserResponse> getAllUsers(Pageable pageable) {
        return userRepository.findAllActiveUsers(pageable)
                .map(userMapper::mapToUserResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserResponse> searchUsers(String keyword, Pageable pageable) {
        return userRepository.searchUsers(keyword, pageable)
                .map(userMapper::mapToUserResponse);
    }
    @Override
    public UserResponse updateUser(Long id, UserRegistrationRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        // Check for conflicts with other users
        if (!user.getEmail().equals(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("Email already exists");
        }

        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());

        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        user = userRepository.save(user);
        return userMapper.mapToUserResponse(user);
    }

    @Override
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        user.setActive(false);
        userRepository.save(user);
    }


    @Override
    public void changePassword(ChangePasswordRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new UnauthorizedException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    public UserResponse updateProfile(UpdateProfileRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        UserProfile profile = user.getProfile();
        if (profile == null) {
            profile = new UserProfile();
            profile.setUser(user);
        }

        profile.setFirstName(request.getFirstName());
        profile.setLastName(request.getLastName());
        profile.setDateOfBirth(request.getDateOfBirth());
        profile.setGender(request.getGender());

        handleAvatar(request, user, profile);
        userProfileRepository.save(profile);
        user.setProfile(profile);
        userRepository.save(user);

        return userMapper.mapToUserResponse(user);
    }


    @Override
    @Transactional(readOnly = true)
    public UserResponse getCurrentUserProfile() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return userMapper.mapToUserResponse(user);
    }

    public void createPassword(PasswordCreationRequest request){
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();

        User user = userRepository.findByUsername(name).orElseThrow(
                () -> new RuntimeException("User not found with username: " + name));

        if (StringUtils.hasText(user.getPassword()))
            throw new RuntimeException("Password already exists");

        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);
    }

    private void handleAvatar(UpdateProfileRequest request, User userEntity, UserProfile profile) {
        if (StringUtils.hasText(request.getAvatarBase64())) {
            String base64String = request.getAvatarBase64();
            String[] parts = base64String.split(",");

            if (parts.length != 2) {
                throw new RuntimeException("Invalid base64 format");
            }

            String mimeType = parts[0];
            String base64Data = parts[1];

            byte[] decodedBytes = Base64.getDecoder().decode(base64Data);

            String fileExtension;
            if (mimeType.contains("image/jpeg")) {
                fileExtension = "jpg";
            } else if (mimeType.contains("image/png")) {
                fileExtension = "png";
            } else {
                throw new RuntimeException("Unsupported image type");
            }

            String fileName = saveFileToFolder(userEntity.getUsername(), userEntity.getId(), fileExtension, decodedBytes);
            String pathAvatarSaveDb = avatarRelativePath + fileName;

            // ✅ GÁN CHÍNH XÁC VÀO UserProfile
            profile.setAvatarUrl(pathAvatarSaveDb);
        }
    }



    private String saveFileToFolder(String username, Long userId, String fileExtension, byte[] decodedBytes) {
        String fileName = "avatar_" + username + "_" + userId + "." + fileExtension;
        String finalPath = rootFolderAvatar + File.separator + fileName;

        File folder = new File(rootFolderAvatar);
        if (!folder.exists()) {
            folder.mkdirs();
        }

        try (FileOutputStream fos = new FileOutputStream(finalPath)) {
            fos.write(decodedBytes);
        } catch (IOException e) {
            throw new RuntimeException("Failed to save avatar file", e);
        }

        return fileName;
    }



}
