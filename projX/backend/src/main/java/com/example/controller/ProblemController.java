package com.example.controller;

import com.example.domain.Problem;
import com.example.dto.ProblemDTO;
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
    public ResponseEntity<List<Problem>> getAllProblems() {
        return ResponseEntity.ok(problemService.getAllProblems());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Problem> getProblemById(@PathVariable Long id) {
        return ResponseEntity.ok(problemService.getProblemById(id));
    }

    @GetMapping("/machine/{machineId}")
    public ResponseEntity<List<Problem>> getProblemsByMachine(@PathVariable Long machineId) {
        return ResponseEntity.ok(problemService.getProblemsByMachine(machineId));
    }

    @PostMapping
    public ResponseEntity<Problem> createProblem(@Valid @RequestBody ProblemDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(problemService.createProblem(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Problem> updateProblem(@PathVariable Long id, @Valid @RequestBody ProblemDTO dto) {
        return ResponseEntity.ok(problemService.updateProblem(id, dto));
    }

    @PatchMapping("/{id}/resolve")
    public ResponseEntity<Problem> resolveProblem(@PathVariable Long id) {
        return ResponseEntity.ok(problemService.resolveProblem(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProblem(@PathVariable Long id) {
        problemService.deleteProblem(id);
        return ResponseEntity.noContent().build();
    }
}
