package com.example.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaintenanceStatsDTO {
    private int tasksCompleted;
    private int tasksPending;
    private double averageRepairTime;
    private int assistedOthers;
    private int wasAssisted;
    private boolean available;
}
