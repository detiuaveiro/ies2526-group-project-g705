package com.example.controller;

import com.example.dto.AssistanceRequestCreateDTO;
import com.example.dto.AssistanceRequestDTO;
import com.example.service.AssistanceRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public AssistanceRequestDTO assign(
            @PathVariable Long id,
            @RequestParam Long technicianId
    ) {
        return assistanceRequestService.assign(id, technicianId);
    }


    @PostMapping("/{id}/complete")
    public AssistanceRequestDTO complete(@PathVariable Long id) {
        return assistanceRequestService.complete(id);
    }
}
