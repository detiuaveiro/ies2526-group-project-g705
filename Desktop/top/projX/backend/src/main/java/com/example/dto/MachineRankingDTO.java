package com.example.dto;

import com.example.domain.Machine;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MachineRankingDTO {
    private Long id;
    private String name;
    private String location;
    private double priority;

    public static MachineRankingDTO from(Machine m, double priority) {
        return new MachineRankingDTO(
                m.getId(),
                m.getName(),
                m.getLocation(),
                priority
        );
    }
}
