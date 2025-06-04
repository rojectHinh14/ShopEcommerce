    package com.Ecommerce.controller;

    import com.Ecommerce.dto.ApiResponse;
    import com.Ecommerce.dto.request.Address.AddressUpdateRequest;
    import com.Ecommerce.dto.response.Address.AddressResponse;
    import com.Ecommerce.service.Impl.AddressServiceImpl;
    import org.springframework.http.ResponseEntity;
    import org.springframework.security.core.context.SecurityContextHolder;
    import org.springframework.security.core.userdetails.UserDetails;
    import org.springframework.web.bind.annotation.*;

    import java.util.List;
    import org.springframework.security.oauth2.jwt.Jwt;
    import com.Ecommerce.dto.request.Address.AddressCreateRequest;
    import org.springframework.http.HttpStatus;

    @RestController
    @RequestMapping("/api/addresses")
    public class AddressController {

        private final AddressServiceImpl addressService;

        public AddressController(AddressServiceImpl addressService) {
            this.addressService = addressService;
        }

        @PostMapping
        public ResponseEntity<ApiResponse<AddressResponse>> createAddress(
                @RequestBody AddressCreateRequest request) {

            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String currentUsername;

            if (principal instanceof UserDetails) {
                currentUsername = ((UserDetails) principal).getUsername();
            } else if (principal instanceof Jwt) {
                currentUsername = ((Jwt) principal).getSubject();
            } else {
                throw new IllegalStateException("Unsupported principal type: " + principal.getClass().getName());
            }

            AddressResponse addressResponse = addressService.createAddress(request, currentUsername);
            return ResponseEntity.status(HttpStatus.CREATED)
                                 .body(ApiResponse.success(addressResponse, "Address created successfully"));
        }

        @PutMapping("/{addressId}")
        public ResponseEntity<ApiResponse<AddressResponse>> updateAddress(
                @PathVariable Long addressId,
                @RequestBody AddressUpdateRequest request) {

            // Lấy thông tin người dùng hiện tại từ SecurityContext
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String currentUsername;

            if (principal instanceof UserDetails) {
                currentUsername = ((UserDetails) principal).getUsername();
            } else if (principal instanceof Jwt) {
                currentUsername = ((Jwt) principal).getSubject();
            } else {
                throw new IllegalStateException("Unsupported principal type: " + principal.getClass().getName());
            }

            // Cập nhật địa chỉ người dùng
            AddressResponse addressResponse = addressService.updateAddress(addressId, request, currentUsername);
            return ResponseEntity.ok(ApiResponse.success(addressResponse));
        }

        // Lấy tất cả địa chỉ của người dùng
        @GetMapping("/my-addresses")
        public ResponseEntity<ApiResponse<List<AddressResponse>>> getUserAddresses() {
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String currentUsername;

            if (principal instanceof UserDetails) {
                currentUsername = ((UserDetails) principal).getUsername();
            } else if (principal instanceof Jwt) {
                currentUsername = ((Jwt) principal).getSubject();
            } else {
                throw new IllegalStateException("Unsupported principal type: " + principal.getClass().getName());
            }

            // Lấy tất cả địa chỉ của người dùng
            List<AddressResponse> addressResponses = addressService.getAddressesByUser(currentUsername);
            return ResponseEntity.ok(ApiResponse.success(addressResponses));
        }

        @DeleteMapping("/{addressId}")
        public ResponseEntity<ApiResponse<Void>> deleteAddress(@PathVariable Long addressId) {
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String currentUsername;

            if (principal instanceof UserDetails) {
                currentUsername = ((UserDetails) principal).getUsername();
            } else if (principal instanceof Jwt) {
                currentUsername = ((Jwt) principal).getSubject();
            } else {
                throw new IllegalStateException("Unsupported principal type: " + principal.getClass().getName());
            }
            addressService.deleteAddress(addressId, currentUsername);
            return ResponseEntity.ok(ApiResponse.success(null, "Address deleted successfully"));
        }
    }
