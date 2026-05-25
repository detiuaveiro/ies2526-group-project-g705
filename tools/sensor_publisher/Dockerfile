FROM python:3.11-slim

WORKDIR /app

# Instala dependências necessárias
RUN pip install --no-cache-dir requests pika

# Copia o script
COPY sensor_publisher.py .

# Executa o script
CMD ["python", "-u", "sensor_publisher.py"]