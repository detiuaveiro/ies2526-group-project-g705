package com.example.service;

import org.springframework.stereotype.Service;

import com.example.domain.MaintenanceTechnician;
import com.example.domain.Problem;
import com.example.domain.Request;
import com.example.domain.User;
import com.example.repository.MaintenanceTechnicianRepository;
import com.example.repository.UserRepository;

import java.util.List;
import java.util.UUID;

@Service
public class MaintenanceTechnicianService {

    private final MaintenanceTechnicianRepository repository;

    public MaintenanceTechnicianService(MaintenanceTechnicianRepository repository) {
        this.repository = repository;
    }

    public Request requestHelp(Problem prolbem,String reason){
        return null;
    }


    public void completeTask(UUID taskID){
        
    }


}