package com.example.controller;

import com.example.domain.Problem;
import com.example.dto.ProblemDTO;
import com.example.dto.ProblemHistoryDTO;
import com.example.service.ProblemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/problems")
@RequiredArgsConstructor
public class ProblemController {

    private final ProblemService problemService;

    @GetMapping
    public ResponseEntity<List<ProblemDTO>> getAllProblems() {
        return ResponseEntity.ok(problemService.getAllProblemsDTO());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProblemDTO> getProblemById(@PathVariable Long id) {
        return ResponseEntity.ok(problemService.getProblemByIdDTO(id));
    }

    @GetMapping("/machine/{machineId}")
    public ResponseEntity<List<ProblemDTO>> getProblemsByMachine(@PathVariable Long machineId) {
        return ResponseEntity.ok(problemService.getProblemsByMachineDTO(machineId));
    }

    @PostMapping
    public ResponseEntity<ProblemDTO> createProblem(@Valid @RequestBody ProblemDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(problemService.createProblemDTO(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProblemDTO> updateProblem(@PathVariable Long id, @Valid @RequestBody ProblemDTO dto) {
        return ResponseEntity.ok(problemService.updateProblemDTO(id, dto));
    }

    @PatchMapping("/{id}/resolve")
    public ResponseEntity<ProblemDTO> resolveProblem(@PathVariable Long id) {
        return ResponseEntity.ok(problemService.resolveProblemDTO(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProblem(@PathVariable Long id) {
        problemService.deleteProblem(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/history")
    public List<ProblemHistoryDTO> getHistory() {
        return problemService.getHistory();
    }
}
