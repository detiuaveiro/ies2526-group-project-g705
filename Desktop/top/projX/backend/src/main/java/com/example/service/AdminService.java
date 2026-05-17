package com.example.service;

import org.springframework.stereotype.Service;

import com.example.domain.Machine;
import com.example.domain.Problem;
import com.example.domain.User;
import com.example.repository.AdminRepository;
import com.example.repository.MaintenanceDirectorRepository;
import com.example.repository.UserRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class AdminService {

    private final AdminRepository repository;

    public AdminService(AdminRepository repository) {
        this.repository = repository;
    }

    public Machine createMachine(Map data){
        return null;
    }


    public void deleteMachine(UUID machineID){
        
    }


    public Map viewTeamPerformance(UUID machineID){
        return null;
    }

}