package com.example.service;

import com.example.domain.User;
import com.example.domain.Technician;
import com.example.domain.enums.UserRole;
import com.example.dto.UserDTO;
import com.example.dto.TechnicianDTO;
import com.example.mapper.TechnicianMapper;
import com.example.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PersistenceContext
    private EntityManager entityManager;


    @Transactional(readOnly = true)
    public List<UserDTO> getAllUsersDTO() {
        return userRepository.findByArchivedFalse()
                .stream()
                .map(UserDTO::fromEntity)
                .toList();
    }


    @Transactional(readOnly = true)
    public UserDTO getUserByIdDTO(Long id) {
        return userRepository.findById(id)
                .map(UserDTO::fromEntity)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public List<TechnicianDTO> getAllTechniciansDTO() {
        return userRepository.findByRoleAndArchivedFalse(UserRole.TECHNICIAN)
                .stream()
                .filter(u -> u instanceof Technician)
                .map(u -> TechnicianMapper.toDTO((Technician) u))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TechnicianDTO> getArchivedTechniciansDTO() {
        return userRepository.findByRoleAndArchivedTrue(UserRole.TECHNICIAN)
                .stream()
                .map(u -> TechnicianMapper.toDTO((Technician) u))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<UserDTO> getAllDirectorsDTO() {
        return userRepository.findByRole(UserRole.DIRECTOR)
                .stream()
                .map(UserDTO::fromEntity)
                .toList();
    }

    public UserDTO createUserDTO(UserDTO dto) {

        String rawPassword = (dto.getPassword() == null || dto.getPassword().isBlank())
                ? "1234"
                : dto.getPassword();

        User user;

        if (dto.getRole() == UserRole.TECHNICIAN) {
            user = new Technician();
        } else {
            user = new User();
        }

        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setRole(dto.getRole());
        user.setActive(true);
        user.setOnline(false);
        user.setPrivileged(false);
        user.setPhoneNumber(dto.getPhoneNumber());
        user.setAge(dto.getAge());
        user.setGender(dto.getGender());

        if (user instanceof Technician tech && dto.getSkillSet() != null) {
            tech.setSkillSet(new java.util.ArrayList<>(dto.getSkillSet()));
        }

        user.setPasswordHash(passwordEncoder.encode(rawPassword));

        return UserDTO.fromEntity(userRepository.save(user));
    }



    public UserDTO updateUserDTO(Long id, UserDTO dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        if (dto.getRole() != null) {
            user.setRole(dto.getRole());
        }
        if (dto.getPhoneNumber() != null) {
            user.setPhoneNumber(dto.getPhoneNumber());
        }
        if (dto.getAge() != null) {
            user.setAge(dto.getAge());
        }
        if (dto.getGender() != null) {
            user.setGender(dto.getGender());
        }
        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            user.setPasswordHash(passwordEncoder.encode(dto.getPassword()));
        }
        if (user instanceof Technician tech && dto.getSkillSet() != null) {
            tech.setSkillSet(new java.util.ArrayList<>(dto.getSkillSet()));
        }

        return UserDTO.fromEntity(userRepository.save(user));
    }

    public void deactivateUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        user.setActive(false);
        userRepository.save(user);
    }

    public UserDTO archiveUserDTO(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        user.setArchived(true);
        user.setActive(false);
        return UserDTO.fromEntity(userRepository.save(user));
    }


    public UserDTO restoreUserDTO(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        user.setArchived(false);
        user.setActive(true);
        return UserDTO.fromEntity(userRepository.save(user));
    }

    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        entityManager.createNativeQuery("UPDATE problems SET assigned_technician_id = NULL WHERE assigned_technician_id = :id")
                .setParameter("id", id).executeUpdate();

        entityManager.createNativeQuery("UPDATE maintenance_records SET technician_id = NULL WHERE technician_id = :id")
                .setParameter("id", id).executeUpdate();

        entityManager.createNativeQuery("DELETE FROM maintenance_sessions WHERE technician_id = :id")
                .setParameter("id", id).executeUpdate();

        entityManager.createNativeQuery("DELETE FROM maintenance_logs WHERE technician_id = :id")
                .setParameter("id", id).executeUpdate();

        entityManager.createNativeQuery("DELETE FROM assistance_requests WHERE requested_by_id = :id OR assigned_technician_id = :id")
                .setParameter("id", id).executeUpdate();

        entityManager.createNativeQuery("DELETE FROM machine_technician WHERE technician_id = :id")
                .setParameter("id", id).executeUpdate();

        entityManager.createNativeQuery("DELETE FROM technician_skills WHERE technician_id = :id")
                .setParameter("id", id).executeUpdate();

        userRepository.delete(user);
    }

}
