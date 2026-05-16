package com.example.mapper;

import java.util.List;
import java.util.Optional;

import com.example.domain.Machine;
import com.example.dto.MachineDTO;
import com.example.dto.TechnicianDTO;

import java.util.stream.Collectors;

public class MachineMapper {

    public static MachineDTO toDTO(Machine m) {

        List<TechnicianDTO> technicians =
                Optional.ofNullable(m.getAssignedTechnicians())
                        .orElse(List.of())
                        .stream()
                        .map(TechnicianMapper::toBasicDTO)
                        .toList();

        return MachineDTO.builder()
                .id(m.getId())
                .name(m.getName())
                .location(m.getLocation())
                .importanceLevel(m.getImportanceLevel())
                .status(m.getStatus())
                .downtimeSum(m.getDowntimeSum())
                .suspicionFlag(m.isSuspicionFlag())
                .vibrationSensor(m.isVibrationSensor())
                .temperatureSensor(m.isTemperatureSensor())
                .pressureSensor(m.isPressureSensor())
                .actionRequiredCount(m.getActionRequiredCount())
                .assistanceRequestedCount(m.getAssistanceRequestedCount())
                .assignedTechnicians(technicians)
                .build();
    }

}
