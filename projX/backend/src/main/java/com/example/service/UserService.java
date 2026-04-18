package com.example.service;

import org.springframework.stereotype.Service;

import com.example.domain.User;
import com.example.repository.UserRepository;

import java.util.List;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    public List<User> getAllUsers() {
        return repository.findAll();
    }

    public User addUser(User user) {
        boolean exists = repository.findAll().stream()
            .anyMatch(e -> e.getUserID().equals(user.getUserID()));

        if (exists) {
            throw new IllegalArgumentException("UserID already exists: " + user.getUserID());
        }

        return repository.save(user);
    }


    public User getUserById(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

}