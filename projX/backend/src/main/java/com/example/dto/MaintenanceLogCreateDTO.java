package com.example.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MaintenanceLogCreateDTO {
    @NotBlank
    private String title;
    
    @NotBlank
    private String description;
    
    @NotNull
    private Double hoursSpent;
    
    @NotBlank
    private String partsUsed;
    
    @NotBlank
    private String technicianId;
}
