package com.example.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TechnicianDTO {

    private Long id;

    private int numberOfFaultsFixed;
    private int assistedCounter;
    private int wasAssistedCounter;
    private double averageRepairTime;
    private int tasksCompleted;
    private int tasksPending;
    private boolean isAvailable;

    private Long currentMachineId;

    private List<String> skillSet;
}
