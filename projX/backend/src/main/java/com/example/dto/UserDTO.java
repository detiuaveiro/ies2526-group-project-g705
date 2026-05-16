package com.example.dto;

import com.example.domain.User;
import com.example.domain.enums.Gender;
import com.example.domain.enums.UserRole;
import lombok.*;

import java.util.List;

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
    private String phoneNumber;
    private Integer age;
    private Gender gender;
    private Boolean available;
    private List<String> skillSet;

    public static UserDTO fromEntity(User u) {
        return UserDTO.builder()
                .id(u.getId())
                .name(u.getName())
                .email(u.getEmail())
                .role(u.getRole())
                .active(u.isActive())
                .online(u.isOnline())
                .privileged(u.isPrivileged())
                .phoneNumber(u.getPhoneNumber())
                .age(u.getAge())
                .gender(u.getGender())
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
        u.setPhoneNumber(phoneNumber);
        u.setAge(age);
        u.setGender(gender);
        return u;
    }
}
