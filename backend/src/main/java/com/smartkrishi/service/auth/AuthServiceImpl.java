package com.smartkrishi.service.auth;

import com.smartkrishi.dto.auth.*;
import com.smartkrishi.entity.BuyerProfile;
import com.smartkrishi.entity.Role;
import com.smartkrishi.entity.SellerProfile;
import com.smartkrishi.entity.User;
import com.smartkrishi.exception.BadRequestException;
import com.smartkrishi.exception.ResourceNotFoundException;
import com.smartkrishi.repository.*;
import com.smartkrishi.security.JwtTokenProvider;
import com.smartkrishi.security.UserDetailsServiceImpl;
import com.smartkrishi.security.UserPrincipal;
import com.smartkrishi.service.notification.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.client.RestTemplate;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Random;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final BuyerProfileRepository buyerProfileRepository;
    private final SellerProfileRepository sellerProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsServiceImpl userDetailsService;
    private final EmailService emailService;
    private final RestTemplate restTemplate;

    @Value("${google.client-id:}")
    private String googleClientId;

    @Override
    public UserResponse register(RegisterRequest request) {
        // Validate passwords match
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Passwords do not match");
        }

        // Check if user already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered");
        }

        if (userRepository.existsByPhone(request.getPhone())) {
            throw new BadRequestException("Phone number already registered");
        }

        // Create new user (active immediately, no OTP required)
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setProfileImage(request.getProfileImage());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setUserStatus(User.UserStatus.ACTIVE);
        user.setEmailVerified(true);
        user.setAuthProvider("LOCAL");

        // Assign roles
        var roles = new HashSet<Role>();
        String userType = request.getUserType() != null ? request.getUserType() : "BUYER";
        
        if ("SELLER".equalsIgnoreCase(userType)) {
            roles.add(roleRepository.findByRoleType(Role.RoleType.ROLE_SELLER)
                    .orElseThrow(() -> new ResourceNotFoundException("Role not found")));
            roles.add(roleRepository.findByRoleType(Role.RoleType.ROLE_USER)
                    .orElseThrow(() -> new ResourceNotFoundException("Role not found")));
        } else {
            roles.add(roleRepository.findByRoleType(Role.RoleType.ROLE_USER)
                    .orElseThrow(() -> new ResourceNotFoundException("Role not found")));
        }
        
        user.setRoles(roles);
        User savedUser = userRepository.save(user);

        // Create profile based on user type
        if ("SELLER".equalsIgnoreCase(userType)) {
            SellerProfile sellerProfile = new SellerProfile();
            sellerProfile.setUser(savedUser);
            sellerProfile.setBusinessName(request.getFirstName() + " " + request.getLastName() + " Store");
            sellerProfile.setBusinessCategory("General");
            sellerProfile.setSellerStatus(SellerProfile.SellerStatus.PENDING);
            sellerProfileRepository.save(sellerProfile);
        } else {
            BuyerProfile buyerProfile = new BuyerProfile();
            buyerProfile.setUser(savedUser);
            buyerProfileRepository.save(buyerProfile);
        }

        log.info("New user registered and activated immediately: {}", savedUser.getEmail());

        return mapUserToResponse(savedUser);
    }

    @Override
    public JwtResponse login(LoginRequest request) {
        // Retrieve user to check verification and auth provider status
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        if (user.getUserStatus() == User.UserStatus.INACTIVE || !user.getEmailVerified()) {
            throw new BadRequestException("Account is inactive. Please verify your email first.");
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            String token = tokenProvider.generateToken(authentication);
            String refreshToken = tokenProvider.generateRefreshToken(request.getEmail());
            
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

            return new JwtResponse(
                    token,
                    refreshToken,
                    "Bearer",
                    tokenProvider.getExpirationTime(),
                    mapUserToResponse(user)
            );
        } catch (Exception e) {
            log.error("Login failed for email: {}", request.getEmail());
            throw new BadRequestException("Invalid email or password");
        }
    }

    @Override
    public JwtResponse refreshToken(String refreshToken) {
        if (!tokenProvider.validateToken(refreshToken)) {
            throw new BadRequestException("Invalid refresh token");
        }

        String email = tokenProvider.getEmailFromToken(refreshToken);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        var roleNames = user.getRoles().stream()
                .map(role -> role.getRoleType().toString())
                .collect(Collectors.toList());

        String newAccessToken = tokenProvider.generateTokenFromEmail(email, user.getId(), roleNames);
        String newRefreshToken = tokenProvider.generateRefreshToken(email);

        return new JwtResponse(
                newAccessToken,
                newRefreshToken,
                "Bearer",
                tokenProvider.getExpirationTime(),
                mapUserToResponse(user)
        );
    }

    @Override
    public void logout(String token) {
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        log.info("User logged out successfully");
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new BadRequestException("User not authenticated");
        }
        
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        
        return mapUserToResponse(user);
    }

    @Override
    public JwtResponse googleLogin(GoogleLoginRequest request) {
        GoogleTokenPayload payload = validateGoogleToken(request.getIdToken());
        
        User user = userRepository.findByEmail(payload.getEmail()).orElse(null);
        
        if (user == null) {
            // New user registration via Google
            user = new User();
            user.setEmail(payload.getEmail());
            // Create a unique phone placeholder
            user.setPhone("G-" + payload.getSub().substring(0, Math.min(17, payload.getSub().length())));
            if (payload.getFamilyName() != null && !payload.getFamilyName().trim().isEmpty()) {
                user.setFirstName(payload.getGivenName() != null && !payload.getGivenName().trim().isEmpty() ? payload.getGivenName() : payload.getName());
                user.setLastName(payload.getFamilyName());
            } else {
                user.setFirstName(payload.getName() != null && !payload.getName().trim().isEmpty() ? payload.getName() : 
                                  (payload.getGivenName() != null && !payload.getGivenName().trim().isEmpty() ? payload.getGivenName() : "Google"));
                user.setLastName("User");
            }
            user.setPasswordHash(passwordEncoder.encode(UUID.randomUUID().toString())); // Secure random password
            user.setProfileImage(payload.getPicture());
            user.setGooglePicture(payload.getPicture());
            user.setUserStatus(User.UserStatus.ACTIVE);
            user.setEmailVerified(true);
            user.setAuthProvider("GOOGLE");
            user.setGoogleId(payload.getSub());

            // Assign roles
            var roles = new HashSet<Role>();
            String userType = request.getUserType() != null ? request.getUserType() : "BUYER";
            if ("SELLER".equalsIgnoreCase(userType)) {
                roles.add(roleRepository.findByRoleType(Role.RoleType.ROLE_SELLER)
                        .orElseThrow(() -> new ResourceNotFoundException("Role not found")));
                roles.add(roleRepository.findByRoleType(Role.RoleType.ROLE_USER)
                        .orElseThrow(() -> new ResourceNotFoundException("Role not found")));
            } else {
                roles.add(roleRepository.findByRoleType(Role.RoleType.ROLE_USER)
                        .orElseThrow(() -> new ResourceNotFoundException("Role not found")));
            }
            user.setRoles(roles);
            user = userRepository.save(user);

            // Create profile based on type
            if ("SELLER".equalsIgnoreCase(userType)) {
                SellerProfile sellerProfile = new SellerProfile();
                sellerProfile.setUser(user);
                sellerProfile.setBusinessName(user.getFirstName() + " " + user.getLastName() + " Store");
                sellerProfile.setBusinessCategory("General");
                sellerProfile.setSellerStatus(SellerProfile.SellerStatus.PENDING);
                sellerProfileRepository.save(sellerProfile);
            } else {
                BuyerProfile buyerProfile = new BuyerProfile();
                buyerProfile.setUser(user);
                buyerProfileRepository.save(buyerProfile);
            }
        } else {
            // User exists: link Google ID if not already linked
            if (user.getGoogleId() == null) {
                user.setGoogleId(payload.getSub());
                user.setAuthProvider("GOOGLE");
                if (user.getProfileImage() == null) {
                    user.setProfileImage(payload.getPicture());
                }
                user.setGooglePicture(payload.getPicture());
                user.setEmailVerified(true);
                user = userRepository.save(user);
            }
        }

        // Generate JWT Access & Refresh Tokens matching standard login
        UserPrincipal userPrincipal = UserPrincipal.create(user);
        Authentication authentication = new UsernamePasswordAuthenticationToken(userPrincipal, null, userPrincipal.getAuthorities());

        String token = tokenProvider.generateToken(authentication);
        String refreshToken = tokenProvider.generateRefreshToken(user.getEmail());

        log.info("Google OAuth login successful for: {}", user.getEmail());

        return new JwtResponse(
                token,
                refreshToken,
                "Bearer",
                tokenProvider.getExpirationTime(),
                mapUserToResponse(user)
        );
    }

    private GoogleTokenPayload validateGoogleToken(String idToken) {
        try {
            String url = "https://oauth2.googleapis.com/tokeninfo?id_token=" + idToken;
            GoogleTokenPayload payload = restTemplate.getForObject(url, GoogleTokenPayload.class);
            if (payload == null || payload.getEmail() == null) {
                throw new BadRequestException("Invalid Google ID Token");
            }
            
            // Validate client ID if configured
            if (googleClientId != null && !googleClientId.trim().isEmpty() && !googleClientId.equals("YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com")) {
                if (!googleClientId.equals(payload.getAud())) {
                    throw new BadRequestException("Google token audience mismatch");
                }
            }
            return payload;
        } catch (Exception e) {
            log.error("Google ID Token validation failed", e);
            throw new BadRequestException("Google ID Token validation failed: " + e.getMessage());
        }
    }

    private UserResponse mapUserToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .profileImage(user.getProfileImage())
                .userStatus(user.getUserStatus().toString())
                .emailVerified(user.getEmailVerified())
                .phoneVerified(user.getPhoneVerified())
                .authProvider(user.getAuthProvider())
                .roles(user.getRoles().stream()
                        .map(role -> role.getRoleType().toString())
                        .collect(Collectors.toSet()))
                .createdAt(user.getCreatedAt())
                .build();
    }
}
