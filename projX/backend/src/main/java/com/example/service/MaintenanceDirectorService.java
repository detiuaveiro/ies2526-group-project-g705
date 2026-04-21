package com.example.service;

import org.springframework.stereotype.Service;

import com.example.domain.Problem;
import com.example.domain.User;
import com.example.repository.MaintenanceDirectorRepository;
import com.example.repository.UserRepository;

import java.util.List;
import java.util.UUID;

@Service
public class MaintenanceDirectorService {

    private final MaintenanceDirectorRepository repository;

    public MaintenanceDirectorService(MaintenanceDirectorRepository repository) {
        this.repository = repository;
    }

    public void assignTechnician(UUID machineID,UUID techinicanID){
        
    }


    public void assignAssistants(UUID requestID){
        
    }


    public List<Problem> reviewMachineHistory(UUID machineID){
        return null;
    }

}