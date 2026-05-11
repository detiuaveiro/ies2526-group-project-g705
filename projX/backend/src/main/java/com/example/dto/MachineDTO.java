package com.example.dto;

import com.example.domain.enums.MachineStatus;
import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MachineDTO {

    private Long id;

    private String name;
    private String location;
    private Integer importanceLevel;
    private MachineStatus status;

    private Double downtimeSum;
    private boolean suspicionFlag;

    private boolean vibrationSensor;
    private boolean temperatureSensor;
    private boolean pressureSensor;

    private int actionRequiredCount;
    private int assistanceRequestedCount;

    private List<TechnicianDTO> assignedTechnicians;
}
