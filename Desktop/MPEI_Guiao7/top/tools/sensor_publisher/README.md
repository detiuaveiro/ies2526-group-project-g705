# Sensor Publisher

This script generates UML-style sensor readings and publishes each row as a JSON message to RabbitMQ.
The payload matches the backend `SensorReadingDTO`, so the RabbitMQ consumer can store the reading through the existing sensor API service.

## Install

```bash
pip install -r requirements.txt
```

## Run

```bash
python sensor_publisher.py --count 10 --csv sensor_readings.csv --host localhost --queue my.queue
```

## Output format

Each message contains:

- `machineId`
- `sensorType` (`TEMPERATURE`, `PRESSURE`, or `VIBRATION`)
- `value`
- `recordedAt`

Use `--machine-ids 1,2,3` if you want the generated readings to alternate between multiple machines.
