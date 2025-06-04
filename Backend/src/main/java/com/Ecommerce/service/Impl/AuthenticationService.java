package com.Ecommerce.service.Impl;

import com.Ecommerce.dto.request.*;
import com.Ecommerce.dto.response.AuthenticationResponse;
import com.Ecommerce.dto.response.IntrospectResponse;
import com.Ecommerce.entity.InvalidatedToken;
import com.Ecommerce.entity.Role;
import com.Ecommerce.entity.User;
import com.Ecommerce.repository.InvalidatedTokenRepository;
import com.Ecommerce.repository.UserRepository;
import com.Ecommerce.repository.httpClient.OutboundIdentityClient;
import com.Ecommerce.repository.httpClient.OutboundUserClient;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.logging.Level;
import java.util.logging.Logger;

@Service
public class AuthenticationService {
    private final UserRepository userRepository;
    private final InvalidatedTokenRepository invalidatedTokenRepository;
    private final OutboundIdentityClient outboundIdentityClient;
    private final OutboundUserClient outboundUserClient;


    private static final Logger logger = Logger.getLogger(AuthenticationService.class.getName());

    @Value("${jwt.signerKey}")
    protected String SIGNER_KEY;

    @Value("${jwt.valid-duration}")
    protected long VALID_DURATION;

    @Value("${jwt.refreshable-duration}")
    protected long REFRESHABLE_DURATION;

    @Value("${outbound.identity.client-id}")
    protected String CLIENT_ID;

    @Value("${outbound.identity.client-secret}")
    protected String CLIENT_SECRET;

    @Value("${outbound.identity.redirect-uri}")
    protected String REDIRECT_URI;

    protected final String GRANT_TYPE = "authorization_code";

    public AuthenticationService(UserRepository userRepository,
                                 InvalidatedTokenRepository invalidatedTokenRepository,
                                 OutboundIdentityClient outboundIdentityClient,
                                 OutboundUserClient outboundUserClient) {
        this.userRepository = userRepository;
        this.invalidatedTokenRepository = invalidatedTokenRepository;
        this.outboundIdentityClient = outboundIdentityClient;
        this.outboundUserClient = outboundUserClient;
    }

    public IntrospectResponse introspect(IntrospectRequest request) throws JOSEException, ParseException {
        var token = request.getToken();
        boolean isValid = true;
        try {
            verifyToken(token, false);
        } catch (Exception e) {
            isValid = false;
        }
        IntrospectResponse response = new IntrospectResponse();
        response.setValid(isValid);
        return response;
    }

    public AuthenticationResponse outboundAuthenticate(String code){
        ExchangeTokenRequest request = new ExchangeTokenRequest();
        request.setCode(code);
        request.setClientId(CLIENT_ID);
        request.setClientSecret(CLIENT_SECRET);
        request.setRedirectUri(REDIRECT_URI);
        request.setGrantType(GRANT_TYPE);

        var response = outboundIdentityClient.exchangeToken(request);

        logger.info("TOKEN RESPONSE " + response);

        var userInfo = outboundUserClient.getUserInfo("json", response.getAccessToken());

        logger.info("User Info " + userInfo);

        Set<Role> roles = new HashSet<>();
        Role roleUser = new Role();
        roleUser.setName("USER");
        roles.add(roleUser);

        Optional<User> userOptional = userRepository.findByUsername(userInfo.getEmail());
        User user;
        if (userOptional.isPresent()) {
            user = userOptional.get();
        } else {
            user = new User();
            user.setUsername(userInfo.getEmail());
            user.setFirstName(userInfo.getGivenName());
            user.setLastName(userInfo.getFamilyName());
            user.setRoles(roles);
            user = userRepository.save(user);
        }

        var token = generateToken(user);

        AuthenticationResponse authResponse = new AuthenticationResponse();
        authResponse.setToken(token);
        return authResponse;
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        User user = userRepository
                .findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        boolean authenticated = passwordEncoder.matches(request.getPassword(), user.getPassword());
        if (!authenticated) throw new RuntimeException("Invalid credentials");

        String token = generateToken(user);

        AuthenticationResponse response = new AuthenticationResponse();
        response.setToken(token);
        response.setAuthenticated(true);
        return response;
    }

    public void logout(LogoutRequest request) throws ParseException, JOSEException {
        try {
            SignedJWT signToken = verifyToken(request.getToken(), true);

            String jit = signToken.getJWTClaimsSet().getJWTID();
            Date expiryTime = signToken.getJWTClaimsSet().getExpirationTime();

            InvalidatedToken invalidatedToken = new InvalidatedToken();
            invalidatedToken.setId(jit);
            invalidatedToken.setExpiryTime(expiryTime);

            invalidatedTokenRepository.save(invalidatedToken);
        } catch (Exception exception){
            logger.info("Token already expired");
        }
    }

    public AuthenticationResponse refreshToken(RefreshRequest request) throws ParseException, JOSEException {
        SignedJWT signedJWT = verifyToken(request.getToken(), true);

        String jit = signedJWT.getJWTClaimsSet().getJWTID();
        Date expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();

        InvalidatedToken invalidatedToken = new InvalidatedToken();
        invalidatedToken.setId(jit);
        invalidatedToken.setExpiryTime(expiryTime);

        invalidatedTokenRepository.save(invalidatedToken);

        String username = signedJWT.getJWTClaimsSet().getSubject();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Unauthenticated"));

        String token = generateToken(user);

        AuthenticationResponse response = new AuthenticationResponse();
        response.setToken(token);
        response.setAuthenticated(true);
        return response;
    }

    private String generateToken(User user) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getUsername())
                .issuer("devteria.com")
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(VALID_DURATION, ChronoUnit.SECONDS).toEpochMilli()
                ))
                .jwtID(UUID.randomUUID().toString())
                .claim("scope", buildScope(user))
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(header, payload);

        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            logger.log(Level.SEVERE, "Cannot create token", e);
            throw new RuntimeException(e);
        }
    }

    private SignedJWT verifyToken(String token, boolean isRefresh) throws JOSEException, ParseException {
        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());
        SignedJWT signedJWT = SignedJWT.parse(token);

        Date expiryTime = (isRefresh)
                ? new Date(signedJWT.getJWTClaimsSet().getIssueTime()
                .toInstant().plus(REFRESHABLE_DURATION, ChronoUnit.SECONDS).toEpochMilli())
                : signedJWT.getJWTClaimsSet().getExpirationTime();

        boolean verified = signedJWT.verify(verifier);

        if (!(verified && expiryTime.after(new Date())))
            throw new RuntimeException("Unauthenticated");

        if (invalidatedTokenRepository.existsById(signedJWT.getJWTClaimsSet().getJWTID()))
            throw new RuntimeException("Unauthenticated");

        return signedJWT;
    }

    private String buildScope(User user) {
        StringJoiner stringJoiner = new StringJoiner(" ");

        if (!CollectionUtils.isEmpty(user.getRoles())) {
            for (Role role : user.getRoles()) {
                stringJoiner.add("ROLE_" + role.getName());
            }
        }
        return stringJoiner.toString();
    }
}
