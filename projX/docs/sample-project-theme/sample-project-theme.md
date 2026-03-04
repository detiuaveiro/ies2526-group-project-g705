# Industrial Monitoring System for Predictive Maintenance

## Concept
An industrial monitoring system that analyzes vibration, pressure, and temperature sensor data to enable predictive maintenance of machinery.

## Data Acquisition Layer
Virtual or physical sensors that continuously collect:
- Vibration (Hz)
- Pressure (bar)
- Temperature (°C)  
from machines.

## Data Publishing
- Each sensor has a **site gateway** acting as a local aggregator.
- The telemetry data is sent to the cloud using a bandwidth-savvy protocol.

## Processing & Business Logic
- Hazard conditions are detected when telemetry reveals operating thresholds are compromised.
- Alarms are forwarded to the mobile devices of the people in charge.

## Integration API
Exposes endpoints to programmatically list industrial assets:
- Location
- Model
- Specifications
Provides access to telemetry readings:
- Current status
- Historical data intervals
Enables external integration with other systems.

## Web Portal
Web-based dashboard for real-time tracking of:
- Machine health
- Operational conditions