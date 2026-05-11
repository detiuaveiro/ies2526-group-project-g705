package com.example.mapper;

import com.example.domain.Problem;
import com.example.dto.ProblemDTO;
import com.example.dto.ProblemHistoryDTO;

public class ProblemMapper {

    public static ProblemDTO toDTO(Problem p) {
        return ProblemDTO.builder()
                .id(p.getId())
                .machineId(p.getMachine().getId())
                .description(p.getDescription())
                .resolved(p.isResolved())
                .startProblemDate(
                        p.getStartProblemDate() != null
                                ? p.getStartProblemDate().toString()
                                : null
                )
                .build();
    }

    public static ProblemHistoryDTO toHistoryDTO(Problem p) {
        return ProblemHistoryDTO.builder()
                .problemId(p.getId())
                .machineName(p.getMachine().getName())
                .description(p.getDescription())
                .resolved(p.isResolved())
                .startProblemDate(
                        p.getStartProblemDate() != null
                                ? p.getStartProblemDate().toString()
                                : null
                )
                .build();
    }
}
