package com.example.controller;

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
    public AssistanceRequestDTO create(@RequestBody AssistanceRequestCreateDTO dto) {
        return assistanceRequestService.create(dto);
    }

    @GetMapping
    public List<AssistanceRequestDTO> getAll(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) Long userId
    ) {
        if (role != null) {
            return assistanceRequestService.getForRole(role, userId);
        }
        return assistanceRequestService.getForAuthenticatedUser();
    }

    @PostMapping("/{id}/assign")
    public ResponseEntity<?> assign(
            @PathVariable Long id,
            @RequestParam Long technicianId
    ) {
        try {
            return ResponseEntity.ok(assistanceRequestService.assign(id, technicianId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }


    @PostMapping("/{id}/complete")
    public AssistanceRequestDTO complete(@PathVariable Long id) {
        return assistanceRequestService.complete(id);
    }
}
