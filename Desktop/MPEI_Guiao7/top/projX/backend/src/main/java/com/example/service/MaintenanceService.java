package com.example.service;

import com.example.domain.Maintenance;
import com.example.dto.MaintenanceDTO;
import com.example.mapper.MaintenanceMapper;
import com.example.repository.MaintenanceRepository;
import com.example.repository.MachineRepository;
import com.example.repository.TechnicianRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MaintenanceService {

    private final MaintenanceRepository maintenanceRepository;
    private final MachineRepository machineRepository;
    private final TechnicianRepository technicianRepository;

    // -------------------------
    //  DTO METHODS
    // -------------------------

    public List<MaintenanceDTO> getAllMaintenanceDTO() {
        return maintenanceRepository.findAll()
                .stream()
                .map(MaintenanceMapper::toDTO)
                .toList();
    }

    public MaintenanceDTO getMaintenanceByIdDTO(Long id) {
        return MaintenanceMapper.toDTO(
                maintenanceRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Maintenance not found"))
        );
    }

    public List<MaintenanceDTO> getMaintenanceByMachineDTO(Long machineId) {
        return maintenanceRepository.findByMachineId(machineId)
                .stream()
                .map(MaintenanceMapper::toDTO)
                .toList();
    }

    public List<MaintenanceDTO> getMaintenanceByTechnicianDTO(Long technicianId) {
        return maintenanceRepository.findByTechnicianId(technicianId)
                .stream()
                .map(MaintenanceMapper::toDTO)
                .toList();
    }

    public MaintenanceDTO createMaintenanceDTO(MaintenanceDTO dto) {
        Maintenance m = MaintenanceMapper.toEntity(dto, machineRepository, technicianRepository);
        return MaintenanceMapper.toDTO(maintenanceRepository.save(m));
    }

    public MaintenanceDTO updateMaintenanceDTO(Long id, MaintenanceDTO dto) {
        Maintenance existing = maintenanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Maintenance not found"));

        MaintenanceMapper.updateEntity(existing, dto, machineRepository, technicianRepository);

        return MaintenanceMapper.toDTO(maintenanceRepository.save(existing));
    }

    public void deleteMaintenance(Long id) {
        maintenanceRepository.deleteById(id);
    }
}
