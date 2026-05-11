package com.example.dto;

import lombok.Data;

@Data
public class TechnicianPerformanceDTO {
    private Long technicianId;
    private String name;
    private int assignedMachines;
    private int completedRepairs;
    private double avgRepairTime;
}
