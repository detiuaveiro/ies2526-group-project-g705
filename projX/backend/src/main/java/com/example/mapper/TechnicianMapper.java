package com.example.mapper;

import com.example.domain.Technician;
import com.example.dto.TechnicianDTO;

public class TechnicianMapper {

    public static TechnicianDTO toDTO(Technician t) {
        return TechnicianDTO.builder()
                .id(t.getId())
                .name(t.getName())
                .build();
    }
}
