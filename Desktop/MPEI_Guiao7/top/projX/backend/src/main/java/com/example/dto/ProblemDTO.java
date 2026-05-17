package com.example.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProblemDTO {

    private Long id;
    private Long machineId;
    private String description;
    private boolean resolved;
    private String startProblemDate;
    private String solvedProblemDate;
}
