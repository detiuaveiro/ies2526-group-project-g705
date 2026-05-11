package com.example.mapper;

import com.example.domain.Maintenance;
import com.example.dto.MaintenanceDTO;
import com.example.repository.MachineRepository;
import com.example.repository.TechnicianRepository;

public class MaintenanceMapper {

    public static MaintenanceDTO toDTO(Maintenance m) {
        return MaintenanceDTO.builder()
                .id(m.getId())
                .machineId(m.getMachine().getId())
                .technicianId(m.getTechnician() != null ? m.getTechnician().getId() : null)
                .type(m.getType())
                .status(m.getStatus())
                .notes(m.getNotes())
                .build();
    }

    public static Maintenance toEntity(
            MaintenanceDTO dto,
            MachineRepository machineRepo,
            TechnicianRepository techRepo
    ) {
        return Maintenance.builder()
                .id(dto.getId())
                .machine(machineRepo.findById(dto.getMachineId())
                        .orElseThrow(() -> new RuntimeException("Machine not found")))
                .technician(dto.getTechnicianId() != null
                        ? techRepo.findById(dto.getTechnicianId())
                            .orElseThrow(() -> new RuntimeException("Technician not found"))
                        : null)
                .type(dto.getType())
                .status(dto.getStatus())
                .notes(dto.getNotes())
                .build();
    }

    public static void updateEntity(
            Maintenance entity,
            MaintenanceDTO dto,
            MachineRepository machineRepo,
            TechnicianRepository techRepo
    ) {
        entity.setMachine(machineRepo.findById(dto.getMachineId())
                .orElseThrow(() -> new RuntimeException("Machine not found")));

        if (dto.getTechnicianId() != null) {
            entity.setTechnician(techRepo.findById(dto.getTechnicianId())
                    .orElseThrow(() -> new RuntimeException("Technician not found")));
        }

        entity.setType(dto.getType());
        entity.setStatus(dto.getStatus());
        entity.setNotes(dto.getNotes());
    }
}
