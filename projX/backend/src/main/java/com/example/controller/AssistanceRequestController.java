package com.example.controller;

import com.example.dto.AssistanceRequestCompleteDTO;
import com.example.dto.AssistanceRequestCreateDTO;
import com.example.dto.AssistanceRequestDTO;
import com.example.service.AssistanceRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/assistance-requests")
@RequiredArgsConstructor
public class AssistanceRequestController {

    private final AssistanceRequestService assistanceRequestService;

    @PostMapping
    public ResponseEntity<?> create(@RequestBody AssistanceRequestCreateDTO dto) {
        try {
            return ResponseEntity.ok(assistanceRequestService.create(dto));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/machine/{machineId}/active")
    public List<AssistanceRequestDTO> getActiveForMachine(@PathVariable Long machineId) {
        return assistanceRequestService.getActiveForMachine(machineId);
    }

    @GetMapping
    public List<AssistanceRequestDTO> getAll(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) Long userId
    ) {
        if (role != null) {
            return assistanceRequestService.getForRole(role, userId);
        }
        return assistanceRequestService.getAll();
    }

    @PostMapping("/{id}/unassign")
    public ResponseEntity<?> unassign(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(assistanceRequestService.unassign(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<?> complete(
            @PathVariable Long id,
            @RequestBody(required = false) AssistanceRequestCompleteDTO dto
    ) {
        try {
            return ResponseEntity.ok(assistanceRequestService.complete(id, dto));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
