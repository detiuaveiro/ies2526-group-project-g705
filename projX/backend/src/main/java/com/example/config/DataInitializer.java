package com.example.config;

import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import com.example.domain.User;
import com.example.domain.enums.Gender;
import com.example.domain.enums.MachineStatus;
import com.example.domain.enums.UserRole;
import com.example.dto.MachineDTO;
import com.example.dto.UserDTO;
import com.example.repository.MachineRepository;
import com.example.repository.UserRepository;
import com.example.service.MachineService;
import com.example.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer {

    private final MachineService machineService;
    private final MachineRepository machineRepository;
    private final UserService userService;
    private final UserRepository userRepository;

    private static final int TOTAL_MACHINES = 100;

    @EventListener(ApplicationReadyEvent.class)
    public void initializeData() {
        log.info("Starting data initialization...");

        if (userRepository.count() == 0) {
            log.info("Creating mock users...");
            
            // Create Maintenance Technicians
            userService.createUserDTO(UserDTO.builder()
                    .name("Jo\u00E3o Neves")
                    .email("joao.neves@example.com")
                    .role(UserRole.TECHNICIAN)
                    .password("password")
                    .build());
            
            userService.createUserDTO(UserDTO.builder()
                    .name("Ana Costa")
                    .email("ana.costa@example.com")
                    .role(UserRole.TECHNICIAN)
                    .password("password")
                    .build());

            // Create Maintenance Director
            userService.createUserDTO(UserDTO.builder()
                    .name("Manuel Gomes")
                    .email("manuel.gomes@example.com")
                    .role(UserRole.DIRECTOR)
                    .password("password")
                    .build());

            // Create Administrator (Sara Lopes)
            userService.createUserDTO(UserDTO.builder()
                    .name("Sara Lopes")
                    .email("sara.lopes@example.com")
                    .role(UserRole.ADMIN)
                    .password("password")
                    .build());
            
            log.info("\u2713 Mock users created!");
        }
        ensureUserProfile("Manuel Gomes", "manuel.gomes@example.com", "915678901", 45, Gender.MALE);
        ensureUserProfile("Sara Lopes", "sara.lopes@example.com", "916789012", 35, Gender.FEMALE);
        ensureTechnicianProfile("João Neves", "joao.neves@example.com", "912345678", 29, Gender.MALE);
        ensureTechnicianProfile("Ana Costa", "ana.costa@example.com", "913456789", 28, Gender.FEMALE);
        ensureTechnicianProfile("Joana Mendes", null, "914567890", 30, Gender.FEMALE);

        if (machineRepository.count() > 0) {
            log.info("Machines already exist in database, skipping machine initialization");
            return;
        }

        try {
            log.info("Creating {} machines...", TOTAL_MACHINES);
            long startTime = System.currentTimeMillis();

            User joao = userRepository.findByEmail("joao.neves@example.com").orElse(null);

            String[] realisticNames = {
                "Compressor Unit A1", "Hydraulic Press B2", "CNC Machine C3", 
                "Conveyor System D1", "Cooling Tower E2", "Turbine F1",
                "Industrial Oven G1", "Packaging Robot H2", "Generator Unit I1", "Mixer Tank J3"
            };

            for (int i = 1; i <= TOTAL_MACHINES; i++) {
                String name = (i <= realisticNames.length) ? realisticNames[i-1] : "Machine " + i;
                
                MachineDTO machineDTO = MachineDTO.builder()
                        .name(name)
                        .location("Production Floor - Section " + ((i - 1) / 10 + 1))
                        .importanceLevel((i % 5) + 1)
                        .status(MachineStatus.ACTIVE)
                        .downtimeSum(0.0)
                        .suspicionFlag(false)
                        .vibrationSensor(true)
                        .temperatureSensor(true)
                        .pressureSensor(true)
                        .build();

                MachineDTO created = machineService.createMachineDTO(machineDTO);

                if (joao != null && i <= 10) {
                    machineService.assignTechnicianDTO(created.getId(), joao.getId());
                }

                if (i % 20 == 0) {
                    log.debug("Created {} machines so far...", i);
                }
            }

            long machineCreationTime = System.currentTimeMillis() - startTime;
            log.info("\u2713 Created {} machines in {}ms", TOTAL_MACHINES, machineCreationTime);
            log.info("\u2713 Data initialization complete! Machines ready for sensor data from sensor_publisher.py");

        } catch (Exception e) {
            log.error("Error during data initialization", e);
            throw new RuntimeException("Data initialization failed", e);
        }
    }
    private void ensureUserProfile(String name, String email, String phoneNumber, Integer age, Gender gender) {
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) return;

        boolean changed = false;

        if (user.getPhoneNumber() == null || user.getPhoneNumber().isBlank()) {
            user.setPhoneNumber(phoneNumber);
            changed = true;
        }

        if (user.getAge() == null) {
            user.setAge(age);
            changed = true;
        }

        if (user.getGender() == null) {
            user.setGender(gender);
            changed = true;
        }

        if (changed) {
            userRepository.save(user);
        }
    }
    private void ensureTechnicianProfile(String name, String email, String phoneNumber, Integer age, Gender gender) {
        User user = null;

        if (email != null) {
            user = userRepository.findByEmail(email).orElse(null);
        }

        if (user == null) {
            user = userRepository.findByRole(UserRole.TECHNICIAN).stream()
                    .filter(u -> name.equalsIgnoreCase(u.getName()))
                    .findFirst()
                    .orElse(null);
        }

        if (user == null) {
            return;
        }

        boolean changed = false;

        if (user.getPhoneNumber() == null || user.getPhoneNumber().isBlank()) {
            user.setPhoneNumber(phoneNumber);
            changed = true;
        }

        if (user.getAge() == null) {
            user.setAge(age);
            changed = true;
        }

        if (user.getGender() == null) {
            user.setGender(gender);
            changed = true;
        }

        if (changed) {
            userRepository.save(user);
            log.info("Updated demo technician profile for {}", name);
        }
    }
}
