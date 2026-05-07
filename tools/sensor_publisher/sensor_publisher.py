#!/usr/bin/env python3
"""Generate realistic sensor readings, write them to CSV, and publish to RabbitMQ.

The generator discovers machine IDs from the backend API, guarantees at least one
reading per machine when possible, and distributes additional readings in a
round-robin pattern so the data scales with more machines.
"""

from __future__ import annotations

import argparse
import csv
import json
import os
import random
import time
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable

import pika
import requests


FIELDNAMES = ["machineId", "sensorType", "value", "recordedAt"]


@dataclass(frozen=True)
class ReadingSpec:
    sensor_type: str
    minimum: float
    maximum: float


READING_SPECS: tuple[ReadingSpec, ...] = (
    ReadingSpec("TEMPERATURE", 18.0, 35.0),
    ReadingSpec("PRESSURE", 980.0, 1035.0),
    ReadingSpec("VIBRATION", 0.0, 1.5),
)


def local_datetime_utc_iso() -> str:
    return datetime.now(timezone.utc).replace(tzinfo=None).isoformat(timespec="microseconds")


def build_reading(machine_id: int, spec: ReadingSpec) -> dict:
    return {
        "machineId": machine_id,
        "sensorType": spec.sensor_type,
        "value": round(random.uniform(spec.minimum, spec.maximum), 3),
        "recordedAt": local_datetime_utc_iso(),
    }


def fetch_machine_ids(api_url: str, retries: int, retry_delay_seconds: float) -> list[int]:
    for attempt in range(1, retries + 1):
        try:
            print(f"Fetching machines from {api_url} (attempt {attempt}/{retries})...")
            response = requests.get(api_url, timeout=10)
            response.raise_for_status()

            payload = response.json()
            if not isinstance(payload, list):
                raise ValueError("Machines API must return a JSON array")

            machine_ids = [machine["id"] for machine in payload if isinstance(machine, dict) and "id" in machine]
            if machine_ids:
                print(f"Found machines: {machine_ids}")
                return machine_ids

            raise ValueError("No machine IDs found in backend response")
        except Exception as exception:
            if attempt == retries:
                raise RuntimeError(f"Failed to fetch machines after {retries} attempts") from exception
            print(f"Backend not ready or invalid ({attempt}/{retries}); retrying in {retry_delay_seconds}s")
            time.sleep(retry_delay_seconds)

    raise RuntimeError("Failed to fetch machine IDs")


def generate_readings(count: int, machine_ids: list[int]) -> list[dict]:
    if not machine_ids:
        raise ValueError("At least one machine is required to generate readings")

    target_count = max(count, len(machine_ids))
    readings: list[dict] = []

    for index in range(target_count):
        machine_id = machine_ids[index % len(machine_ids)]
        if index < len(machine_ids):
            spec = READING_SPECS[index % len(READING_SPECS)]
        else:
            spec = random.choice(READING_SPECS)
        readings.append(build_reading(machine_id, spec))

    random.shuffle(readings)
    return readings


def write_csv(csv_path: Path, readings: Iterable[dict]) -> None:
    csv_path.parent.mkdir(parents=True, exist_ok=True)

    with csv_path.open("w", newline="", encoding="utf-8") as file_handle:
        writer = csv.DictWriter(file_handle, fieldnames=FIELDNAMES)
        writer.writeheader()
        writer.writerows(readings)


def publish_readings(
    readings: Iterable[dict],
    host: str,
    port: int,
    username: str,
    password: str,
    queue_name: str,
    retries: int,
    retry_delay_seconds: float,
) -> None:
    readings = list(readings)
    credentials = pika.PlainCredentials(username, password)
    parameters = pika.ConnectionParameters(host=host, port=port, credentials=credentials)

    connection = None

    for attempt in range(1, retries + 1):
        try:
            connection = pika.BlockingConnection(parameters)
            break
        except pika.exceptions.AMQPConnectionError:
            if attempt == retries:
                raise ConnectionError("Failed to connect to RabbitMQ")
            print(f"RabbitMQ not ready ({attempt}/{retries})... retrying")
            time.sleep(retry_delay_seconds)

    try:
        channel = connection.channel()
        channel.queue_declare(queue=queue_name, durable=True)

        for reading in readings:
            body = json.dumps(reading)
            channel.basic_publish(
                exchange="",
                routing_key=queue_name,
                body=body.encode("utf-8"),
                properties=pika.BasicProperties(
                    content_type="application/json",
                    delivery_mode=2,
                ),
            )

        print(f"Published {len(readings)} readings")
    finally:
        if connection is not None:
            connection.close()


def parse_args():
    parser = argparse.ArgumentParser()

    parser.add_argument("--count", type=int, default=int(os.getenv("SENSOR_COUNT", "1000")))
    parser.add_argument("--api-url", default=os.getenv("API_URL", "http://toname:8080/api/v1/machines"))

    parser.add_argument("--host", default=os.getenv("RABBITMQ_HOST", "rabbitmq"))
    parser.add_argument("--port", type=int, default=int(os.getenv("RABBITMQ_PORT", "5672")))
    parser.add_argument("--username", default=os.getenv("RABBITMQ_USERNAME", "guest"))
    parser.add_argument("--password", default=os.getenv("RABBITMQ_PASSWORD", "guest"))
    parser.add_argument("--queue", default=os.getenv("SENSOR_QUEUE", "my.queue"))
    parser.add_argument("--csv-path", default=os.getenv("CSV_PATH", "/app/sensor_readings.csv"))
    parser.add_argument("--retries", type=int, default=int(os.getenv("API_RETRIES", "60")))
    parser.add_argument(
        "--retry-delay-seconds",
        type=float,
        default=float(os.getenv("API_RETRY_DELAY_SECONDS", "2")),
    )

    return parser.parse_args()


def main() -> None:
    args = parse_args()

    machine_ids = fetch_machine_ids(args.api_url, args.retries, args.retry_delay_seconds)
    readings = generate_readings(args.count, machine_ids)

    write_csv(Path(args.csv_path), readings)
    publish_readings(
        readings,
        args.host,
        args.port,
        args.username,
        args.password,
        args.queue,
        args.retries,
        args.retry_delay_seconds,
    )

    print(f"Done. Generated {len(readings)} readings across {len(machine_ids)} machines.")


if __name__ == "__main__":
    main()