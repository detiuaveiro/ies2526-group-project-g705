package com.example.dto;

import com.example.domain.enums.Gender;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TechnicianDTO {
    private Long id;
    private String name;
    private String email;
    private String phoneNumber;
    private Integer age;
    private Gender gender;
    private boolean active;
    private boolean privileged;
    private boolean available;
    private List<String> skillSet;
}
