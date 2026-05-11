package com.example.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AssistanceRequestCreateDTO {
    private Long machineId;
    private Long problemId;
    private Long requestedById;
    private String reason;
}
