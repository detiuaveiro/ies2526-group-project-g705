FROM python:3.11-slim

WORKDIR /app

# Instala dependências necessárias
RUN pip install --no-cache-dir requests pika

# Copia o script
COPY populate_all_machines.py .

# Executa o script
CMD ["python", "populate_all_machines.py"]