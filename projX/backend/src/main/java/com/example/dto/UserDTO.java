package com.example.dto;

import com.example.domain.User;
import com.example.domain.enums.UserRole;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {

    private Long id;
    private String name;
    private String email;
    private UserRole role;
    private boolean active;
    private boolean online;
    private boolean privileged;
    private String password;

    public static UserDTO fromEntity(User u) {
        return UserDTO.builder()
                .id(u.getId())
                .name(u.getName())
                .email(u.getEmail())
                .role(u.getRole())
                .active(u.isActive())
                .online(u.isOnline())
                .privileged(u.isPrivileged())
                .build();
    }

    public User toEntity() {
        User u = new User();
        u.setId(id);
        u.setName(name);
        u.setEmail(email);
        u.setRole(role != null ? role : UserRole.TECHNICIAN);
        u.setActive(active);
        u.setOnline(online);
        u.setPrivileged(privileged);
        return u;
    }
}
