package com.example.controller;

import com.example.domain.AssistanceRequest;
import com.example.dto.AssistanceRequestDTO;
import com.example.service.AssistanceRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/requests")
@RequiredArgsConstructor
public class AssistanceRequestController {

    private final AssistanceRequestService requestService;

    @GetMapping
    public ResponseEntity<List<AssistanceRequest>> getAllRequests() {
        return ResponseEntity.ok(requestService.getAllRequests());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AssistanceRequest> getRequestById(@PathVariable Long id) {
        return ResponseEntity.ok(requestService.getRequestById(id));
    }

    @GetMapping("/technician/{technicianId}")
    public ResponseEntity<List<AssistanceRequest>> getRequestsByTechnician(@PathVariable Long technicianId) {
        return ResponseEntity.ok(requestService.getRequestsByTechnician(technicianId));
    }

    @PostMapping
    public ResponseEntity<AssistanceRequest> createRequest(@Valid @RequestBody AssistanceRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(requestService.createRequest(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AssistanceRequest> updateRequest(@PathVariable Long id, @Valid @RequestBody AssistanceRequestDTO dto) {
        return ResponseEntity.ok(requestService.updateRequest(id, dto));
    }

    @PatchMapping("/{id}/accept")
    public ResponseEntity<AssistanceRequest> acceptRequest(
            @PathVariable Long id,
            @RequestParam Long technicianId) {
        return ResponseEntity.ok(requestService.acceptRequest(id, technicianId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRequest(@PathVariable Long id) {
        requestService.deleteRequest(id);
        return ResponseEntity.noContent().build();
    }
}
