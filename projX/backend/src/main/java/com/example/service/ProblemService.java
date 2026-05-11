package com.example.service;

import com.example.domain.Machine;
import com.example.domain.Problem;
import com.example.dto.ProblemDTO;
import com.example.dto.ProblemHistoryDTO;
import com.example.mapper.ProblemMapper;
import com.example.repository.MachineRepository;
import com.example.repository.ProblemRepository;
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

    @Transactional(readOnly = true)
    public List<ProblemDTO> getAllProblemsDTO() {
        return problemRepository.findAll()
                .stream()
                .map(ProblemMapper::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProblemDTO getProblemByIdDTO(Long id) {
        return problemRepository.findById(id)
                .map(ProblemMapper::toDTO)
                .orElseThrow(() -> new EntityNotFoundException("Problem not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public List<ProblemDTO> getProblemsByMachineDTO(Long machineId) {
        return problemRepository.findByMachineId(machineId)
                .stream()
                .map(ProblemMapper::toDTO)
                .toList();
    }

    public ProblemDTO createProblemDTO(ProblemDTO dto) {
        Machine machine = machineRepository.findById(dto.getMachineId())
                .orElseThrow(() -> new EntityNotFoundException("Machine not found"));

        Problem problem = Problem.builder()
                .machine(machine)
                .description(dto.getDescription())
                .resolved(dto.isResolved())
                .startProblemDate(LocalDateTime.now())
                .build();

        return ProblemMapper.toDTO(problemRepository.save(problem));
    }

    public ProblemDTO updateProblemDTO(Long id, ProblemDTO dto) {
        Problem problem = problemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Problem not found"));

        problem.setDescription(dto.getDescription());
        problem.setResolved(dto.isResolved());

        return ProblemMapper.toDTO(problemRepository.save(problem));
    }

    public ProblemDTO resolveProblemDTO(Long id) {
        Problem problem = problemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Problem not found"));

        problem.setResolved(true);
        problem.setSolvedProblemDate(LocalDateTime.now());

        return ProblemMapper.toDTO(problemRepository.save(problem));
    }

    public void deleteProblem(Long id) {
        Problem problem = problemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Problem not found"));
        problemRepository.delete(problem);
    }

    @Transactional(readOnly = true)
    public List<ProblemHistoryDTO> getHistory() {
        return problemRepository.findAll()
                .stream()
                .map(ProblemMapper::toHistoryDTO)
                .toList();
    }
}
