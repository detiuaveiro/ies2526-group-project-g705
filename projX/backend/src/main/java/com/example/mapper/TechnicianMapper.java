package com.example.mapper;

import com.example.domain.Technician;
import com.example.dto.TechnicianDTO;

public class TechnicianMapper {

    public static TechnicianDTO toDTO(Technician t) {
        return TechnicianDTO.builder()
                .id(t.getId())
                .name(t.getName())
                .email(t.getEmail())
                .phoneNumber(t.getPhoneNumber())
                .age(t.getAge())
                .gender(t.getGender())
                .active(t.isActive())
                .privileged(t.isPrivileged())
                .available(t.isAvailable())
                .skillSet(t.getSkillSet())
                .build();
    }

    public static TechnicianDTO toBasicDTO(Technician t) {
        return TechnicianDTO.builder()
                .id(t.getId())
                .name(t.getName())
                .email(t.getEmail())
                .build();
    }
}
