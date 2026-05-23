package com.example.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class MaintenanceSessionDTO {
    private Long id;
    private Long technicianId;
    private String technicianName;
    private Long machineId;
    private String machineName;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private boolean active;
    private Long maintenanceRecordId;
    private Long assistanceRequestId;
    private String sessionType;
}
