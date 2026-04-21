package com.example.service;

import com.example.domain.Maintenance;
import com.example.dto.MaintenanceDTO;
import com.example.repository.MachineRepository;
import com.example.repository.MaintenanceRepository;
import com.example.repository.TechnicianRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class MaintenanceService {

    private final MaintenanceRepository maintenanceRepository;
    private final MachineRepository machineRepository;
    private final TechnicianRepository technicianRepository;

    @Transactional(readOnly = true)
    public List<Maintenance> getAllMaintenance() {
        return maintenanceRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Maintenance getMaintenanceById(Long id) {
        return maintenanceRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Maintenance record not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public List<Maintenance> getMaintenanceByMachine(Long machineId) {
        return maintenanceRepository.findByMachineId(machineId);
    }

    @Transactional(readOnly = true)
    public List<Maintenance> getMaintenanceByTechnician(Long technicianId) {
        return maintenanceRepository.findByTechnicianId(technicianId);
    }

    public Maintenance createMaintenance(MaintenanceDTO dto) {
        var machine = machineRepository.findById(dto.getMachineId())
                .orElseThrow(() -> new EntityNotFoundException("Machine not found with id: " + dto.getMachineId()));

        var technician = dto.getTechnicianId() != null
                ? technicianRepository.findById(dto.getTechnicianId())
                        .orElseThrow(() -> new EntityNotFoundException("Technician not found with id: " + dto.getTechnicianId()))
                : null;

        Maintenance maintenance = Maintenance.builder()
                .machine(machine)
                .technician(technician)
                .type(dto.getType())
                .status(dto.getStatus())
                .notes(dto.getNotes())
                .build();

        return maintenanceRepository.save(maintenance);
    }

    public Maintenance updateMaintenance(Long id, MaintenanceDTO dto) {
        Maintenance maintenance = getMaintenanceById(id);
        maintenance.setType(dto.getType());
        maintenance.setStatus(dto.getStatus());
        maintenance.setNotes(dto.getNotes());

        if (dto.getTechnicianId() != null) {
            var technician = technicianRepository.findById(dto.getTechnicianId())
                    .orElseThrow(() -> new EntityNotFoundException("Technician not found with id: " + dto.getTechnicianId()));
            maintenance.setTechnician(technician);
        }

        return maintenanceRepository.save(maintenance);
    }

    public void deleteMaintenance(Long id) {
        maintenanceRepository.delete(getMaintenanceById(id));
    }
}
