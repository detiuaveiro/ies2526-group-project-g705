package com.example.dto;

import com.example.domain.enums.RequestStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssistanceRequestDTO {

    private Long id;

    @NotNull
    private Long problemId;

    @NotNull
    private Long requestedById;

    @NotBlank
    private String reason;

    private RequestStatus status;

    private Long assignedTechnicianId;
}
