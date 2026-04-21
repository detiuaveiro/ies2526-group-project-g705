package com.example.dto;

import com.example.domain.enums.Gender;
import com.example.domain.enums.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {

    private Long id;

    @NotBlank
    private String name;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String password;

    private String phoneNumber;

    private Integer age;

    private Gender gender;

    @NotNull
    private UserRole role;

    private boolean isActive;
    private boolean isOnline;
    private boolean isPrivileged;
}
