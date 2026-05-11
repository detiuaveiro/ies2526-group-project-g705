package com.example.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.domain.Problem;
import com.example.domain.Technician;
import com.example.dto.TechnicianPerformanceDTO;
import com.example.repository.ProblemRepository;
import com.example.repository.TechnicianRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TechnicianPerformanceService {

    private final TechnicianRepository technicianRepository;
    private final ProblemRepository problemRepository;

    public List<TechnicianPerformanceDTO> getTechnicianPerformance() {

        List<Technician> technicians = technicianRepository.findAll();
        List<Problem> problems = problemRepository.findAll();

        List<TechnicianPerformanceDTO> result = new ArrayList<>();

        for (Technician tech : technicians) {

            TechnicianPerformanceDTO dto = new TechnicianPerformanceDTO();
            dto.setTechnicianId(tech.getId());
            dto.setName(tech.getName());

            long completed = problems.stream()
                    .filter(p -> p.getAssignedTechnician() != null &&
                                 p.getAssignedTechnician().getId().equals(tech.getId()) &&
                                 p.isResolved())
                    .count();
            dto.setCompletedRepairs((int) completed);

            double avgRepairTime = problems.stream()
                    .filter(p -> p.getAssignedTechnician() != null &&
                                 p.getAssignedTechnician().getId().equals(tech.getId()) &&
                                 p.isResolved() &&
                                 p.getStartProblemDate() != null &&
                                 p.getSolvedProblemDate() != null)
                    .mapToDouble(p -> {
                        long diff = java.time.Duration.between(
                                p.getStartProblemDate(),
                                p.getSolvedProblemDate()
                        ).toMinutes();
                        return diff / 60.0;
                    })
                    .average()
                    .orElse(0.0);

            dto.setAvgRepairTime(avgRepairTime);

            dto.setAssignedMachines(0);

            result.add(dto);
        }

        return result;
    }
}
