package com.example.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProblemDTO {

    private Long id;

    @NotNull
    private Long machineId;

    @NotBlank
    private String description;

    private Double priority;

    private boolean resolved;

    private LocalDateTime startProblemDate;
    private LocalDateTime solvedProblemDate;

    private String faultSeverity;

    private Long assignedTechnicianId;
}
