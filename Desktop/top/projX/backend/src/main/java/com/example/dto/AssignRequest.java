package com.example.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;


@Getter
@Setter
public class AssignRequest {
    private Long technicianId;
    private List<Long> technicianIds;
}
