package com.example.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.domain.Technician;
import com.example.domain.User;
import com.example.dto.UserDTO;
import com.example.service.UserService;
import com.example.dto.TechnicianDTO;


import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsersDTO());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserByIdDTO(id));
    }

    @GetMapping("/technicians")
    public ResponseEntity<List<TechnicianDTO>> getAllTechnicians() {
        return ResponseEntity.ok(userService.getAllTechniciansDTO());
    }

    @GetMapping("/directors")
    public ResponseEntity<List<UserDTO>> getAllDirectors() {
        return ResponseEntity.ok(userService.getAllDirectorsDTO());
    }

    @PostMapping
    public ResponseEntity<UserDTO> createUser(@Valid @RequestBody UserDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.createUserDTO(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Long id, @Valid @RequestBody UserDTO dto) {
        return ResponseEntity.ok(userService.updateUserDTO(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }


    @PutMapping("/{id}/archive")
    public ResponseEntity<UserDTO> archiveUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.archiveUserDTO(id));
    }

    @PutMapping("/{id}/restore")
    public ResponseEntity<UserDTO> restoreUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.restoreUserDTO(id));
    }
}
