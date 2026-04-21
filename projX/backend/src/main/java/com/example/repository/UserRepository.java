package com.example.repository;

import com.example.domain.User;
import com.example.domain.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByIsActive(boolean isActive);
    List<User> findByRole(UserRole role);
    boolean existsByEmail(String email);
}
