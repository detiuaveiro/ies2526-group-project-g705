package com.example.service;

import com.example.domain.Machine;
import com.example.domain.enums.MachineStatus;
import com.example.dto.MachineDTO;
import com.example.repository.MachineRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class MachineService {

    private final MachineRepository machineRepository;

    @Transactional(readOnly = true)
    public List<Machine> getAllMachines() {
        return machineRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Machine getMachineById(Long id) {
        return machineRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Machine not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public List<Machine> getArchivedMachines() {
        return machineRepository.findByArchivedAtIsNotNull();
    }

    @Transactional(readOnly = true)
    public List<Machine> getActiveMachines() {
        return machineRepository.findByArchivedAtIsNull();
    }

    public Machine createMachine(MachineDTO dto) {
        Machine machine = Machine.builder()
                .name(dto.getName())
                .location(dto.getLocation())
                .importanceLevel(dto.getImportanceLevel())
                .status(dto.getStatus() != null ? dto.getStatus() : MachineStatus.ACTIVE)
                .downtimeSum(dto.getDowntimeSum() != null ? dto.getDowntimeSum() : 0.0)
                .suspicionFlag(dto.isSuspicionFlag())
                .build();
        return machineRepository.save(machine);
    }

    public Machine updateMachine(Long id, MachineDTO dto) {
        Machine machine = getMachineById(id);
        machine.setName(dto.getName());
        machine.setLocation(dto.getLocation());
        machine.setImportanceLevel(dto.getImportanceLevel());
        machine.setStatus(dto.getStatus());
        machine.setSuspicionFlag(dto.isSuspicionFlag());
        if (dto.getDowntimeSum() != null) {
            machine.setDowntimeSum(dto.getDowntimeSum());
        }
        return machineRepository.save(machine);
    }

    /** Archives machine: sets status=ARCHIVED and archivedAt timestamp */
    public Machine archiveMachine(Long id) {
        Machine machine = getMachineById(id);
        machine.setStatus(MachineStatus.ARCHIVED);
        machine.setArchivedAt(LocalDateTime.now());
        return machineRepository.save(machine);
    }

    public void deleteMachine(Long id) {
        Machine machine = getMachineById(id);
        machineRepository.delete(machine);
    }
}
