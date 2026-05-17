package com.example.controller;

import com.example.dto.MaintenanceLogCreateDTO;
import com.example.dto.MaintenanceLogDTO;
import com.example.service.MaintenanceLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/v1/maintenance")
@RequiredArgsConstructor
public class MaintenanceLogController {

    private final MaintenanceLogService logService;

    @PostMapping("/{maintenanceId}/log")
    public MaintenanceLogDTO createLog(
            @PathVariable String maintenanceId,
            @Valid @RequestBody MaintenanceLogCreateDTO dto
    ) {
        return logService.createLog(maintenanceId, dto);
    }

    @GetMapping("/{maintenanceId}/logs")
    public List<MaintenanceLogDTO> getLogs(@PathVariable String maintenanceId) {
        return logService.getLogsByMaintenance(maintenanceId);
    }

    @GetMapping("/logs/all")
    public List<MaintenanceLogDTO> getAllLogs() {
        return logService.getAllLogs();
    }

}
