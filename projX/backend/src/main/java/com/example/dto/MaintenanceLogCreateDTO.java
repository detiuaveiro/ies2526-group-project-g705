package com.example.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MaintenanceLogCreateDTO {
    private String title;
    private String description;
    private Double hoursSpent;
    private Double cost;
    private String partsUsed;
    private String technicianId;
}
