package com.example.service;

import com.example.domain.Maintenance;
import com.example.domain.MaintenanceLog;
import com.example.domain.MaintenanceTechnician;
import com.example.dto.MaintenanceLogCreateDTO;
import com.example.dto.MaintenanceLogDTO;
import com.example.repository.MaintenanceLogRepository;
import com.example.repository.MaintenanceRepository;
import com.example.repository.MaintenanceTechnicianRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class MaintenanceLogService {

    private final MaintenanceLogRepository logRepository;
    private final MaintenanceRepository maintenanceRepository;
    private final MaintenanceTechnicianRepository technicianRepository;

    public MaintenanceLogDTO createLog(String maintenanceId, MaintenanceLogCreateDTO dto) {

        Maintenance maintenance = maintenanceRepository.findById(Long.valueOf(maintenanceId))
                .orElseThrow(() -> new RuntimeException("Maintenance not found"));

        MaintenanceTechnician tech = technicianRepository.findById(Long.valueOf(dto.getTechnicianId()))
                .orElseThrow(() -> new RuntimeException("Technician not found"));

        MaintenanceLog log = MaintenanceLog.builder()
                .maintenance(maintenance)
                .technician(tech)
                .title(dto.getTitle())
                .description(dto.getDescription())
                .hoursSpent(dto.getHoursSpent())
                .cost(dto.getCost())
                .partsUsed(dto.getPartsUsed())
                .build();

        return toDTO(logRepository.save(log));
    }

    public List<MaintenanceLogDTO> getLogsByMaintenance(String maintenanceId) {
        return logRepository.findByMaintenanceId(Long.valueOf(maintenanceId))
                .stream()
                .map(this::toDTO)
                .toList();
    }

    private MaintenanceLogDTO toDTO(MaintenanceLog log) {
        MaintenanceLogDTO dto = new MaintenanceLogDTO();
        dto.setId(log.getId());
        dto.setTitle(log.getTitle());
        dto.setDescription(log.getDescription());
        dto.setHoursSpent(log.getHoursSpent());
        dto.setCost(log.getCost());
        dto.setPartsUsed(log.getPartsUsed());
        dto.setTechnicianName(log.getTechnician().getName());
        dto.setCreatedAt(log.getCreatedAt().toString());
        dto.setMaintenanceId(log.getMaintenance().getId());
        dto.setMachineId(log.getMaintenance().getMachine().getId());
        return dto;
    }

    @Transactional(readOnly = true)
    public List<MaintenanceLogDTO> getAllLogs() {
        return logRepository.findAll()
                .stream()
                .map(this::toDTO)
                .toList();
    }

}
