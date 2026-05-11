package com.example.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProblemHistoryDTO {
    private Long problemId;
    private String machineName;
    private String description;
    private boolean resolved;
    private String startProblemDate;
}
