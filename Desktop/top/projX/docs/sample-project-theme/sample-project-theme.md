# Industrial Monitoring System for Predictive Maintenance

## Concept
An industrial monitoring system that analyzes vibration, pressure, and temperature sensor data to enable predictive maintenance of machinery.

## Data Acquisition Layer
Virtual or physical sensors that continuously collect:
1. Vibration (Hz)
2. Pressure (bar)
3. Temperature (°C)  
from machines.

## Data Publishing
1. Each sensor has a **site gateway** acting as a local aggregator.
2. The telemetry data is sent to the cloud using a bandwidth-savvy protocol.

## Processing & Business Logic
1. Hazard conditions are detected when telemetry reveals operating thresholds are compromised.
2. Alarms are forwarded to the mobile devices of the people in charge.

## Integration API
Exposes endpoints to programmatically list industrial assets:  
1. Location
2. Model
3. Specifications
Provides access to telemetry readings:  
4. Current status
5. Historical data intervals
Enables external integration with other systems.  

## Web Portal
Web-based dashboard for real-time tracking of:  
1. Machine health  
2. Operational conditions  