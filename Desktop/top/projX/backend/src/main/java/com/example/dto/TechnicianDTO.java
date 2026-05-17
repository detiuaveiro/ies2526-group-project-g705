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
    private String name;
    private String email;
    private String phoneNumber;
    private boolean available;
    private String currentMachineName;
    private String currentActivity;
    private int tasksCompleted;
    private int tasksPending;
    private int numberOfFaultsFixed;
    private double averageRepairTime;
    private List<String> skillSet;
}
