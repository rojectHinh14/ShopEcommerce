package com.Ecommerce.controller;

import com.Ecommerce.dto.ApiResponse;
import com.Ecommerce.dto.request.AuthenticationRequest;
import com.Ecommerce.dto.request.IntrospectRequest;
import com.Ecommerce.dto.request.LogoutRequest;
import com.Ecommerce.dto.request.RefreshRequest;
import com.Ecommerce.dto.response.AuthenticationResponse;
import com.Ecommerce.dto.response.IntrospectResponse;
import com.Ecommerce.service.Impl.AuthenticationService;
import com.nimbusds.jose.JOSEException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {
    @Autowired
    AuthenticationService authenticationService;

    @PostMapping("/outbound/authentication")
    ApiResponse<AuthenticationResponse> outboundAuthenticate(
            @RequestParam("code") String code
    ) {
        var result = authenticationService.outboundAuthenticate(code);
        return ApiResponse.success(result, "Your custom message");
    }

    @PostMapping("/token")
    ApiResponse<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
        var result = authenticationService.authenticate(request);
        return ApiResponse.success(result, "Your custom message");
    }

    @PostMapping("/introspect")
    ApiResponse<IntrospectResponse> authenticate(@RequestBody IntrospectRequest request)
            throws ParseException, JOSEException {
        var result = authenticationService.introspect(request);
        return ApiResponse.success(result, "Your custom message");
    }

    @PostMapping("/refresh")
    ApiResponse<AuthenticationResponse> authenticate(@RequestBody RefreshRequest request)
            throws ParseException, JOSEException {
        var result = authenticationService.refreshToken(request);
        return ApiResponse.success(result, "Your custom message");
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout(@RequestBody LogoutRequest request) throws ParseException, JOSEException {
        authenticationService.logout(request);
        ApiResponse<Void> response = new ApiResponse<>();
        // Nếu không cần truyền message hay data thì giữ nguyên như này
        return response;
    }

}
