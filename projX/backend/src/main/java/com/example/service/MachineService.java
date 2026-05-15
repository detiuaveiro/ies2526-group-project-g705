package com.example.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.domain.Machine;
import com.example.domain.Technician;
import com.example.domain.enums.MachineStatus;
import com.example.dto.MachineDTO;
import com.example.dto.MachineRankingDTO;
import com.example.mapper.MachineMapper;
import com.example.repository.MachineRepository;
import com.example.repository.TechnicianRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Service
@RequiredArgsConstructor
@Transactional
public class MachineService {

    private final MachineRepository machineRepository;
    private final TechnicianRepository technicianRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional(readOnly = true)
    public List<MachineDTO> getAllMachinesDTO() {
        return machineRepository.findAll()
                .stream()
                .map(MachineMapper::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public MachineDTO getMachineByIdDTO(Long id) {
        return machineRepository.findById(id)
                .map(MachineMapper::toDTO)
                .orElseThrow(() -> new EntityNotFoundException("Machine not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public List<MachineDTO> getArchivedMachinesDTO() {
        return machineRepository.findByArchivedAtIsNotNull()
                .stream()
                .map(MachineMapper::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<MachineDTO> getActiveMachinesDTO() {
        return machineRepository.findByArchivedAtIsNull()
                .stream()
                .map(MachineMapper::toDTO)
                .toList();
    }

    public MachineDTO createMachineDTO(MachineDTO dto) {
        Machine machine = Machine.builder()
                .name(dto.getName())
                .location(dto.getLocation())
                .importanceLevel(dto.getImportanceLevel())
                .status(dto.getStatus() != null ? dto.getStatus() : MachineStatus.ACTIVE)
                .downtimeSum(dto.getDowntimeSum() != null ? dto.getDowntimeSum() : 0.0)
                .suspicionFlag(dto.isSuspicionFlag())
                .vibrationSensor(dto.isVibrationSensor())
                .temperatureSensor(dto.isTemperatureSensor())
                .pressureSensor(dto.isPressureSensor())
                .build();

        return MachineMapper.toDTO(machineRepository.save(machine));
    }

    public MachineDTO updateMachineDTO(Long id, MachineDTO dto) {
        Machine machine = machineRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Machine not found with id: " + id));

        machine.setName(dto.getName());
        machine.setLocation(dto.getLocation());
        machine.setImportanceLevel(dto.getImportanceLevel());
        machine.setStatus(dto.getStatus());
        machine.setSuspicionFlag(dto.isSuspicionFlag());

        if (dto.getDowntimeSum() != null) {
            machine.setDowntimeSum(dto.getDowntimeSum());
        }

        machine.setVibrationSensor(dto.isVibrationSensor());
        machine.setTemperatureSensor(dto.isTemperatureSensor());
        machine.setPressureSensor(dto.isPressureSensor());

        if (dto.getAssignedTechnicians() != null) {
            List<Technician> techs = dto.getAssignedTechnicians().stream()
                    .map(t -> technicianRepository.findById(t.getId())
                            .orElseThrow(() -> new EntityNotFoundException("Technician not found with id: " + t.getId())))
                    .collect(Collectors.toList());
            machine.setAssignedTechnicians(techs);
        }

        return MachineMapper.toDTO(machineRepository.save(machine));
    }

    public MachineDTO restoreMachineDTO(Long id) {
        Machine machine = machineRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Machine not found with id: " + id));
        machine.setStatus(MachineStatus.ACTIVE);
        machine.setArchivedAt(null);
        return MachineMapper.toDTO(machineRepository.save(machine));
    }

    public void deleteMachine(Long id) {
        Machine machine = machineRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Machine not found with id: " + id));

        entityManager.createNativeQuery("UPDATE technicians SET current_machine_id = NULL WHERE current_machine_id = :id")
                .setParameter("id", id).executeUpdate();

        entityManager.createNativeQuery("DELETE FROM machine_technician WHERE machine_id = :id")
                .setParameter("id", id).executeUpdate();

        entityManager.createNativeQuery("DELETE FROM sensor_readings WHERE machine_id = :id")
                .setParameter("id", id).executeUpdate();

        entityManager.createNativeQuery("DELETE FROM maintenance_sessions WHERE machine_id = :id")
                .setParameter("id", id).executeUpdate();

        entityManager.createNativeQuery("DELETE FROM maintenance_logs WHERE maintenance_id IN (SELECT id FROM maintenance_records WHERE machine_id = :id)")
                .setParameter("id", id).executeUpdate();

        entityManager.createNativeQuery("DELETE FROM maintenance_records WHERE machine_id = :id")
                .setParameter("id", id).executeUpdate();

        entityManager.createNativeQuery("DELETE FROM assistance_requests WHERE problem_id IN (SELECT id FROM problems WHERE machine_id = :id)")
                .setParameter("id", id).executeUpdate();

        entityManager.createNativeQuery("DELETE FROM problems WHERE machine_id = :id")
                .setParameter("id", id).executeUpdate();

        machineRepository.delete(machine);
    }

    @Transactional(readOnly = true)
    public List<MachineRankingDTO> getMachinesRanked() {
        List<Machine> machines = machineRepository.findAll();

        return machines.stream()
                .map(m -> {
                    double priority = calculatePriority(m);
                    return MachineRankingDTO.from(m, priority);
                })
                .sorted(Comparator.comparingDouble(MachineRankingDTO::getPriority).reversed())
                .toList();
    }

    private double calculatePriority(Machine m) {
        double importance = m.getImportanceLevel() != null ? m.getImportanceLevel() : 0;
        double downtime = m.getDowntimeSum() != null ? m.getDowntimeSum() : 0;

        return importance * 0.5 + downtime * 0.4;
    }

    public MachineDTO archiveMachineDTO(Long id) {
        Machine machine = machineRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Machine not found with id: " + id));
        machine.setStatus(MachineStatus.ARCHIVED);
        machine.setArchivedAt(LocalDateTime.now());
        return MachineMapper.toDTO(machineRepository.save(machine));
    }

    public MachineDTO assignTechnicianDTO(Long machineId, Long technicianId) {
        Machine machine = machineRepository.findById(machineId)
                .orElseThrow(() -> new EntityNotFoundException("Machine not found"));

        Technician tech = technicianRepository.findById(technicianId)
                .orElseThrow(() -> new EntityNotFoundException("Technician not found"));

        // Avoid duplicates - only add if not already assigned
        if (!machine.getAssignedTechnicians().contains(tech)) {
            machine.getAssignedTechnicians().add(tech);
        }
        return MachineMapper.toDTO(machineRepository.save(machine));
    }

    public MachineDTO assignTechniciansDTO(Long machineId, List<Long> technicianIds) {
        Machine machine = machineRepository.findById(machineId)
                .orElseThrow(() -> new EntityNotFoundException("Machine not found"));

        List<Technician> newTechs = new ArrayList<>();
        for (Long technicianId : technicianIds) {
            Technician tech = technicianRepository.findById(technicianId)
                    .orElseThrow(() -> new EntityNotFoundException("Technician not found with id: " + technicianId));
            newTechs.add(tech);
        }
        
        machine.setAssignedTechnicians(newTechs);
        return MachineMapper.toDTO(machineRepository.save(machine));
    }

    public List<MachineDTO> getMachinesAssignedToTechnicianDTO(Long technicianId) {
        return machineRepository.findAll().stream()
                .filter(m -> m.getAssignedTechnicians() != null &&
                        m.getAssignedTechnicians().stream()
                                .anyMatch(t -> t.getId().equals(technicianId)))
                .map(MachineMapper::toDTO)
                .toList();
    }
}
