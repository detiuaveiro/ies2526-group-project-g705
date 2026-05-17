package com.example.controller;

import com.example.dto.TechnicianDTO;
import com.example.dto.TechnicianPerformanceDTO;
import com.example.service.TechnicianPerformanceService;
import com.example.service.TechnicianService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/technicians")
@RequiredArgsConstructor
public class TechnicianPerformanceController {

    private final TechnicianPerformanceService performanceService;
    private final TechnicianService technicianService;

    @GetMapping
    public List<TechnicianDTO> getAllTechnicians() {
        return technicianService.getAllTechniciansDTO();
    }

    @GetMapping("/performance")
    public List<TechnicianPerformanceDTO> getPerformance() {
        return performanceService.getTechnicianPerformance();
    }
}
