FROM python:3.8.10-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install Python deps only
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source
COPY . .

EXPOSE 7860

CMD ["uvicorn", "Server:app", "--host", "0.0.0.0", "--port", "7860"]
