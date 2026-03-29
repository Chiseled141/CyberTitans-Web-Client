package com.Se2.CyberWebApp.controller;

import com.Se2.CyberWebApp.entity.User;
import com.Se2.CyberWebApp.entity.UserExperience;
import com.Se2.CyberWebApp.repository.UserRepository;
import com.Se2.CyberWebApp.repository.UserExperienceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/team")
public class TeamController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserExperienceRepository experienceRepository;

    // --- API 1: Take list of all Mem ---
    @GetMapping("/members")
    public ResponseEntity<?> getTeamMembers() {
        List<User> users = userRepository.findAll();
        List<Map<String, Object>> teamList = new ArrayList<>();

        for (User user : users) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", user.getId());
            map.put("name", user.getName());
            map.put("avatar", user.getAvatar());
            map.put("role", (user.getRoleEntity() != null) ? user.getRoleEntity().getName() : "MEMBER");

            teamList.add(map);
        }

        return ResponseEntity.ok(teamList);
    }

    // --- API 2: Detail of 1 Member ---
    @GetMapping("/members/{id}")
    public ResponseEntity<?> getMemberDetail(@PathVariable Integer id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        List<UserExperience> experiences = experienceRepository.findByUserIdOrderByStartDateDesc(id);

        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("name", user.getName());
        response.put("avatar", user.getAvatar());
        response.put("role", (user.getRoleEntity() != null) ? user.getRoleEntity().getName() : "MEMBER");
        response.put("experiences", experiences);
        response.put("phone", user.getPhone() != null ? user.getPhone() : "CLASSIFIED");
        response.put("address", user.getAddress() != null ? user.getAddress() : "UNKNOWN LOCATION");
        response.put("email", user.getEmail() != null ? user.getEmail() : "ENCRYPTED");
        response.put("coin", user.getCoin() != null ? user.getCoin() : 0);

        return ResponseEntity.ok(response);
    }

    // --- API 3: Update info and coin ---
    @PutMapping("/members/{id}")
    public ResponseEntity<?> updateMemberProfile(@PathVariable Integer id, @RequestBody Map<String, Object> updateData) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        if (updateData.containsKey("name")) {
            user.setName(updateData.get("name").toString());
        }
        if (updateData.containsKey("phone")) {
            user.setPhone(updateData.get("phone").toString());
        }
        if (updateData.containsKey("address")) {
            user.setAddress(updateData.get("address").toString());
        }
        if (updateData.containsKey("email")) {
            user.setEmail(updateData.get("email").toString());
        }

        if (updateData.containsKey("coin")) {
            try {
                Integer newCoinBalance = Integer.parseInt(updateData.get("coin").toString());
                user.setCoin(newCoinBalance);
            } catch (NumberFormatException e) {
                System.out.println("[SYSTEM] Lỗi định dạng số Coin: " + e.getMessage());
            }
        }

        userRepository.save(user);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Tactical Data & Economy updated successfully.");
        return ResponseEntity.ok(response);
    }
    @PostMapping("/members/{mentorId}/request-mentor")
    public ResponseEntity<?> requestMentor(@PathVariable Integer mentorId, @RequestBody Map<String, Integer> requestData) {
        Integer menteeId = requestData.get("menteeId");
        int MENTOR_COST = 500; // Đặt giá thuê Mentor là 500 Coins

        // 1. Transfer coin
        User mentee = userRepository.findById(menteeId).orElse(null);
        User mentor = userRepository.findById(mentorId).orElse(null);

        if (mentee == null || mentor == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Target not found."));
        }

        // 2. Check if the sender is self-employed
        if (mentee.getId().equals(mentor.getId())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Bạn không thể tự thuê chính mình!"));
        }

        // 3. Check if coin is enough
        if (mentee.getCoin() == null || mentee.getCoin() < MENTOR_COST) {
            return ResponseEntity.badRequest().body(Map.of("message", "INSUFFICIENT FUNDS: Không đủ Coin."));
        }

        // 4. Minus coin
        mentee.setCoin(mentee.getCoin() - MENTOR_COST);
        userRepository.save(mentee);

        // 5. (Tương lai) Tại đây bạn sẽ lưu 1 dòng vào bảng `Notification` trong DB cho Mentor.
        // Hiện tại, chúng ta báo giao dịch thành công về cho Frontend.

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Request sent successfully!");
        response.put("remainingCoins", mentee.getCoin());

        return ResponseEntity.ok(response);
    }
    @DeleteMapping("/members/{id}")
    public ResponseEntity<?> deleteMember(@PathVariable Integer id) {
        // 1. Tìm user
        return userRepository.findById(id).map(user -> {
            // 2. Thực hiện xóa
            userRepository.delete(user);
            return ResponseEntity.ok(Map.of("message", "Operative terminated successfully."));
        }).orElse(ResponseEntity.notFound().build());
    }
}