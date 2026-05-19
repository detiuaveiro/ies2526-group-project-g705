package com.example.service;

import com.example.domain.Maintenance;
import com.example.domain.MaintenanceLog;
import com.example.domain.Technician;
import com.example.dto.MaintenanceLogCreateDTO;
import com.example.dto.MaintenanceLogDTO;
import com.example.repository.MaintenanceLogRepository;
import com.example.repository.MaintenanceRepository;
import com.example.repository.TechnicianRepository;
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
    private final TechnicianRepository technicianRepository;

    public MaintenanceLogDTO createLog(String maintenanceId, MaintenanceLogCreateDTO dto) {

        Maintenance maintenance = maintenanceRepository.findById(Long.valueOf(maintenanceId))
                .orElseThrow(() -> new RuntimeException("Maintenance not found"));

        Technician tech = technicianRepository.findById(Long.valueOf(dto.getTechnicianId()))
                .orElseThrow(() -> new RuntimeException("Technician not found"));

        MaintenanceLog log = MaintenanceLog.builder()
                .maintenance(maintenance)
                .technician(tech)
                .title(dto.getTitle())
                .description(dto.getDescription())
                .hoursSpent(dto.getHoursSpent())
                .partsUsed(dto.getPartsUsed())
                .build();

        return toDTO(logRepository.save(log));
    }

    public List<MaintenanceLogDTO> getLogsByMaintenance(String maintenanceId) {
        return logRepository.findByMaintenanceIdOrderByCreatedAtDesc(Long.valueOf(maintenanceId))
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
        dto.setPartsUsed(log.getPartsUsed());
        dto.setTechnicianName(log.getTechnician().getName());
        dto.setCreatedAt(log.getCreatedAt() != null ? log.getCreatedAt().toString() : null);
        dto.setMaintenanceId(log.getMaintenance().getId());
        dto.setMachineId(log.getMaintenance().getMachine().getId());
        return dto;
    }

    @Transactional(readOnly = true)
    public List<MaintenanceLogDTO> getAllLogs() {
        return logRepository.findAll(org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "createdAt"))
                .stream()
                .map(this::toDTO)
                .toList();
    }

}
