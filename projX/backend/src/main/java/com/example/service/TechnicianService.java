package com.example.service;

import com.example.dto.TechnicianDTO;
import com.example.mapper.TechnicianMapper;
import com.example.repository.TechnicianRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TechnicianService {

    private final TechnicianRepository technicianRepository;

    public List<TechnicianDTO> getAllTechniciansDTO() {
        return technicianRepository.findAll()
                .stream()
                .map(TechnicianMapper::toDTO)
                .toList();
    }


    public TechnicianDTO getTechnicianByIdDTO(Long id) {
        return technicianRepository.findById(id)
                .map(TechnicianMapper::toDTO)
                .orElseThrow(() -> new RuntimeException("Technician not found"));
    }
}
