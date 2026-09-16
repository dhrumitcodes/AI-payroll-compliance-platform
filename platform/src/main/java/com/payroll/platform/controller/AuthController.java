package com.payroll.platform.controller;

import com.payroll.platform.model.User;
import com.payroll.platform.repository.UserRepository;
import com.payroll.platform.security.JwtService;
import com.payroll.platform.security.LoginAttemptService;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private LoginAttemptService loginAttemptService;

    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("OK");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody Map<String, String> request
    ) {

        try {

            String email = request.get("email");
            String password = request.get("password");

            if (email == null || password == null) {

                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(
                                Map.of(
                                        "message",
                                        "Email and password required"
                                )
                        );
            }

            email = email.trim();

            if (loginAttemptService.isLocked(email)) {

                long secondsLeft = loginAttemptService.secondsUntilUnlock(email);

                return ResponseEntity
                        .status(HttpStatus.TOO_MANY_REQUESTS)
                        .body(
                                Map.of(
                                        "message",
                                        "Too many failed login attempts. Try again in "
                                                + Math.max(1, secondsLeft / 60)
                                                + " minute(s)."
                                )
                        );
            }

            Optional<User> userOptional =
                    userRepository.findByEmail(email);

            if (userOptional.isEmpty()) {

                loginAttemptService.recordFailure(email);

                System.err.println(
                        "LOGIN FAIL: No user found for email -> "
                                + email
                );

                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(
                                Map.of(
                                        "message",
                                        "Invalid email or password"
                                )
                        );
            }

            User user = userOptional.get();

            if (!passwordEncoder.matches(
                    password,
                    user.getPassword()
            )) {

                loginAttemptService.recordFailure(email);

                System.err.println(
                        "LOGIN FAIL: Password mismatch for email -> "
                                + email
                );

                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(
                                Map.of(
                                        "message",
                                        "Invalid email or password"
                                )
                        );
            }

            loginAttemptService.recordSuccess(email);

            // Generate REAL JWT
            String token =
                    jwtService.generateToken(user);

            System.out.println(
                    "LOGIN SUCCESS: " + user.getEmail()
            );

            return ResponseEntity.ok(
                    Map.of(
                            "token", token,
                            "email", user.getEmail(),
                            "role", user.getRole(),
                            "companyId",
                            user.getCompanyId() != null
                                    ? user.getCompanyId()
                                    : 0
                    )
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(
                            Map.of(
                                    "message",
                                    "Server error: "
                                            + e.getMessage()
                            )
                    );
        }
    }
}