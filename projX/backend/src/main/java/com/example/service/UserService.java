package com.example.service;

import com.example.domain.Technician;
import com.example.domain.User;
import com.example.domain.enums.UserRole;
import com.example.dto.UserDTO;
import com.example.repository.TechnicianRepository;
import com.example.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final TechnicianRepository technicianRepository;

    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional(readOnly = true)
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public List<Technician> getAllTechnicians() {
        return technicianRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<User> getAllDirectors() {
        return userRepository.findByRole(UserRole.DIRECTOR);
    }

    public User createUser(UserDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Email already in use: " + dto.getEmail());
        }

        User user;
        if (dto.getRole() == UserRole.TECHNICIAN) {
            user = new Technician();
        } else if (dto.getRole() == UserRole.DIRECTOR) {
            user = new com.example.domain.Director();
        } else {
            user = new User();
        }

        applyUserFields(user, dto);
        return userRepository.save(user);
    }

    public User updateUser(Long id, UserDTO dto) {
        User user = getUserById(id);
        applyUserFields(user, dto);
        return userRepository.save(user);
    }

    /** Soft delete – sets isActive = false */
    public void deactivateUser(Long id) {
        User user = getUserById(id);
        user.setActive(false);
        userRepository.save(user);
    }

    private void applyUserFields(User user, UserDTO dto) {
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        // In a real app, hash the password – stored plain-text here for simplicity
        user.setPasswordHash(dto.getPassword());
        user.setPhoneNumber(dto.getPhoneNumber());
        user.setAge(dto.getAge());
        user.setGender(dto.getGender());
        user.setRole(dto.getRole());
        user.setActive(dto.isActive());
        user.setPrivileged(dto.isPrivileged());
    }
}
