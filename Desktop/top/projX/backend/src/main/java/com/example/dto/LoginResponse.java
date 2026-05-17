package com.example.dto;

public record LoginResponse(
        String token,
        String role,
        String name,
        Long id
) {}

