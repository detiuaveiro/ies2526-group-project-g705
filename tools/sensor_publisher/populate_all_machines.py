import os, requests, pika, json, random, time
from datetime import datetime

# ENSURE THIS MATCHES RabbitMQConfig.SENSOR_READINGS_QUEUE IN JAVA
QUEUE_NAME = "my.queue" 
API_URL = os.getenv("API_URL", "http://toname:8080/api/v1/machines")
RABBIT_HOST = os.getenv("RABBITMQ_HOST", "rabbitmq")
INTERVALO = int(os.getenv("PUBLISH_INTERVAL", "30"))

def run():
    print(f"🚀 Worker iniciado. Queue: {QUEUE_NAME}")
    while True:
        try:
            response = requests.get(API_URL, timeout=5)
            data = response.json()
            
            if not data:
                print("⌛ Backend sem máquinas. A aguardar...")
                time.sleep(5)
                continue

            machine_ids = [m["id"] for m in data]
            conn = pika.BlockingConnection(pika.ConnectionParameters(host=RABBIT_HOST))
            ch = conn.channel()
            ch.queue_declare(queue=QUEUE_NAME, durable=True)

            for m_id in machine_ids:
                for s_type in ["TEMPERATURE", "PRESSURE", "VIBRATION"]:
                    payload = {
                        "machineId": m_id,
                        "sensorType": s_type,
                        "value": round(random.uniform(20, 100), 2),
                        # Format to match Java's expected LocalDateTime
                        "recordedAt": datetime.now().strftime("%Y-%m-%dT%H:%M:%S")
                    }
                    ch.basic_publish(exchange='', routing_key=QUEUE_NAME, body=json.dumps(payload))
            
            conn.close()
            print(f"✅ Enviado para {len(machine_ids)} máquinas.")
            time.sleep(INTERVALO)
        except Exception as e:
            print(f"⚠️ Erro: {e}")
            time.sleep(5)

if __name__ == "__main__":
    run()