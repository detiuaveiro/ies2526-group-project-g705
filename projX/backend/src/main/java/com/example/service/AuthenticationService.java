package com.example.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.repository.UserRepository;

@Service
public class AuthenticationService {
    @Autowired private UserRepository userRepository;

    public void login(String email, String password) {
        
    }
}