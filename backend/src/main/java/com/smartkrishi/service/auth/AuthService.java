package com.smartkrishi.service.auth;

import com.smartkrishi.dto.auth.*;

public interface AuthService {
    
    UserResponse register(RegisterRequest registerRequest);
    
    JwtResponse login(LoginRequest loginRequest);
    
    JwtResponse refreshToken(String refreshToken);
    
    void logout(String token);
    
    UserResponse getCurrentUser();

    JwtResponse googleLogin(GoogleLoginRequest googleLoginRequest);
}
