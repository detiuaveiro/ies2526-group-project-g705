package com.example.dto;

import com.example.domain.enums.MaintenanceStatus;
import com.example.domain.enums.MaintenanceType;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaintenanceDTO {

    private Long id;

    @NotNull
    private Long machineId;

    private Long technicianId;

    @NotNull
    private MaintenanceType type;

    @NotNull
    private MaintenanceStatus status;

    private String notes;
}
