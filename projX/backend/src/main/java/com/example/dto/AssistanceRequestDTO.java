package com.example.dto;

import com.example.domain.enums.AssistanceRequestStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class AssistanceRequestDTO {
    private Long id;
    private Long problemId;
    private String problemDescription;
    private Long machineId;
    private String machineName;
    private Long requestedById;
    private String requestedByName;
    private Long assignedTechnicianId;
    private String assignedTechnicianName;
    private String reason;
    private AssistanceRequestStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime acceptedAt;
    private LocalDateTime completedAt;
}
