package com.Se2.CyberWebApp.controller;

import com.Se2.CyberWebApp.dto.LoginDTO;
import com.Se2.CyberWebApp.entity.User;
import com.Se2.CyberWebApp.repository.UserRepository;
import com.Se2.CyberWebApp.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.Se2.CyberWebApp.entity.Role;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginRequest) {
        // 1. Find user by Name
        Optional<User> userOpt = userRepository.findByUsername(loginRequest.getUsername());

        if (userOpt.isPresent()) {
            User user = userOpt.get();

            // 2. Check pass
            if (loginRequest.getPassword() == null ||
                    loginRequest.getPassword().isEmpty() ||
                    !user.getPasswordHash().equals(loginRequest.getPassword())) {

                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Sai mật khẩu!");
            }

            // 3. Create Token
            String token = jwtUtil.generateToken(user);
            System.out.println("[SERVER] Đã tạo Token cho: " + user.getUsername());

            // 4. Return data with token
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("id", user.getId());
            response.put("username", user.getUsername());
            response.put("name", user.getName());
            response.put("role", user.getRoleEntity() != null ? user.getRoleEntity().getName() : "MEMBER");
            response.put("coin", user.getCoin());

            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Tài khoản không tồn tại!");
        }
    }
    // Change PW
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String oldPassword = request.get("oldPassword");
        String newPassword = request.get("newPassword");

        // 1. Validate the incoming request data
        if (username == null || oldPassword == null || newPassword == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid request data."));
        }

        // 2. Retrieve the operative's profile from the database
        return userRepository.findByUsername(username).map(user -> {

            // 3. Verify the current password (Plain text comparison for now)
            if (!user.getPasswordHash().equals(oldPassword)) {
                return ResponseEntity.status(400).body(Map.of("message", "Incorrect current password."));
            }

            // 4. Update with the new security key and save to the database
            user.setPasswordHash(newPassword);
            userRepository.save(user);

            return ResponseEntity.ok(Map.of("message", "Security key updated successfully."));

        }).orElse(ResponseEntity.status(404).body(Map.of("message", "Operative profile not found.")));
    }
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        String username = request.get("username");
        String email = request.get("email");
        String password = request.get("password");

        // 1. Validate data presence
        if (name == null || username == null || email == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "All fields are strictly required for initialization."));
        }

        // 2. Check for existing username to prevent duplicates
        if (userRepository.findByUsername(username).isPresent()) {
            return ResponseEntity.status(409).body(Map.of("message", "Identifier already exists in the system."));
        }

        // 3. Initialize new Operative profile
        User newUser = new User();
        newUser.setName(name);
        newUser.setUsername(username);
        newUser.setEmail(email);
        newUser.setPasswordHash(password);
        newUser.setCoin(100); // Give them a welcome bonus of 100 coins
        newUser.setPoint(0.0);

        // 4. Assign default Clearance Level (MEMBER = ID 4)
        Role defaultRole = new Role();
        defaultRole.setId(4);
        newUser.setRoleEntity(defaultRole);

        userRepository.save(newUser);

        return ResponseEntity.ok(Map.of("message", "Registration complete. You may now execute login."));
    }
}