package com.example.repository;

import com.example.domain.Reading;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReadingRepository extends JpaRepository<Reading, Long> {
    
    // Este método é o que usas no Service
    List<Reading> findBySensorIdOrderByTimestampDesc(Long sensorId);
}