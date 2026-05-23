import os, requests, pika, json, random, time
from datetime import datetime

# ENSURE THIS MATCHES RabbitMQConfig.SENSOR_READINGS_QUEUE IN JAVA
QUEUE_NAME = "my.queue" 
API_URL = os.getenv("API_URL", "http://toname:8080/api/v1/machines")
RABBIT_HOST = os.getenv("RABBITMQ_HOST", "rabbitmq")
INTERVALO = int(os.getenv("PUBLISH_INTERVAL", "10"))

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

            print(f"📦 Gerando dados para {len(machine_ids)} máquinas...")
            for m_id in machine_ids:
                # print(f"  - Máquina {m_id}") # Debugging
                # Assign a profile based on ID to make machines distinct
                # Profile 1: Faulty (High outlier chance)
                # Profile 2: Heavy Duty (High baseline)
                # Profile 3: Standard (Stable)
                
                if m_id % 7 == 0:
                    profile = "FAULTY"
                    outlier_chance = 0.35
                elif m_id % 4 == 0:
                    profile = "HEAVY_DUTY"
                    outlier_chance = 0.10
                else:
                    profile = "STANDARD"
                    outlier_chance = 0.03

                # Add a unique offset per machine so they don't look identical
                machine_offset = (m_id % 10) * 0.5 

                for s_type in ["TEMPERATURE", "PRESSURE", "VIBRATION"]:
                    is_outlier = random.random() < outlier_chance
                    
                    if s_type == "TEMPERATURE":
                        if profile == "HEAVY_DUTY":
                            base = random.uniform(65, 80) + machine_offset
                        else:
                            base = random.uniform(40, 55) + machine_offset
                        value = random.uniform(90, 115) if is_outlier else base
                        
                    elif s_type == "PRESSURE":
                        if profile == "HEAVY_DUTY":
                            base = random.uniform(4, 5.5) + (machine_offset / 10)
                        else:
                            base = random.uniform(2, 3.5) + (machine_offset / 10)
                        value = random.uniform(6.5, 9.5) if is_outlier else base
                        
                    else:  # VIBRATION
                        if profile == "HEAVY_DUTY":
                            base = random.uniform(0.3, 0.5) + (machine_offset / 100)
                        else:
                            base = random.uniform(0.1, 0.25) + (machine_offset / 100)
                        value = random.uniform(0.8, 1.8) if is_outlier else base

                    payload = {
                        "machineId": m_id,
                        "sensorType": s_type,
                        "value": round(value, 2),
                        "recordedAt": datetime.now().strftime("%Y-%m-%dT%H:%M:%S")
                    }
                    ch.basic_publish(exchange='', routing_key=QUEUE_NAME, body=json.dumps(payload))
            
            conn.close()
            print(f"✅ Enviado para {len(machine_ids)} máquinas com perfis variados (Standard, Heavy Duty, Faulty).")
            time.sleep(INTERVALO)
        except Exception as e:
            print(f"⚠️ Erro: {e}")
            time.sleep(5)

if __name__ == "__main__":
    run()