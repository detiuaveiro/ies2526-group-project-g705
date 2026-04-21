package com.example.service;

import com.example.domain.Problem;
import com.example.domain.Technician;
import com.example.dto.ProblemDTO;
import com.example.repository.MachineRepository;
import com.example.repository.ProblemRepository;
import com.example.repository.TechnicianRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProblemService {

    private final ProblemRepository problemRepository;
    private final MachineRepository machineRepository;
    private final TechnicianRepository technicianRepository;

    @Transactional(readOnly = true)
    public List<Problem> getAllProblems() {
        return problemRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Problem getProblemById(Long id) {
        return problemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Problem not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public List<Problem> getProblemsByMachine(Long machineId) {
        return problemRepository.findByMachineId(machineId);
    }

    public Problem createProblem(ProblemDTO dto) {
        var machine = machineRepository.findById(dto.getMachineId())
                .orElseThrow(() -> new EntityNotFoundException("Machine not found with id: " + dto.getMachineId()));

        Technician technician = null;
        if (dto.getAssignedTechnicianId() != null) {
            technician = technicianRepository.findById(dto.getAssignedTechnicianId())
                    .orElseThrow(() -> new EntityNotFoundException("Technician not found with id: " + dto.getAssignedTechnicianId()));
        }

        Problem problem = Problem.builder()
                .machine(machine)
                .description(dto.getDescription())
                .priority(dto.getPriority())
                .resolved(dto.isResolved())
                .startProblemDate(dto.getStartProblemDate())
                .faultSeverity(dto.getFaultSeverity())
                .assignedTechnician(technician)
                .build();

        return problemRepository.save(problem);
    }

    public Problem updateProblem(Long id, ProblemDTO dto) {
        Problem problem = getProblemById(id);
        problem.setDescription(dto.getDescription());
        problem.setPriority(dto.getPriority());
        problem.setResolved(dto.isResolved());
        problem.setStartProblemDate(dto.getStartProblemDate());
        problem.setSolvedProblemDate(dto.getSolvedProblemDate());
        problem.setFaultSeverity(dto.getFaultSeverity());

        if (dto.getAssignedTechnicianId() != null) {
            Technician technician = technicianRepository.findById(dto.getAssignedTechnicianId())
                    .orElseThrow(() -> new EntityNotFoundException("Technician not found with id: " + dto.getAssignedTechnicianId()));
            problem.setAssignedTechnician(technician);
        }

        return problemRepository.save(problem);
    }

    /** Marks a problem as resolved, recording the resolution timestamp */
    public Problem resolveProblem(Long id) {
        Problem problem = getProblemById(id);
        problem.setResolved(true);
        problem.setSolvedProblemDate(LocalDateTime.now());
        return problemRepository.save(problem);
    }

    public void deleteProblem(Long id) {
        problemRepository.delete(getProblemById(id));
    }
}
