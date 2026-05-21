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

    // ADD THESE
    private Integer age;
    private Gender gender;

    private boolean available;
    private String currentMachineName;
    private String currentActivity;
    private int tasksCompleted;
    private int tasksPending;
    private int numberOfFaultsFixed;
    private int assistedCounter;
    private double averageRepairTime;
    private List<String> skillSet;
}