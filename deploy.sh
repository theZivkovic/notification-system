cd producer && docker build -t rabbitmq-producer:latest -f Dockerfile.dev . && cd ..;
cd consumer && docker build -t rabbitmq-consumer:latest -f Dockerfile.dev . && cd ..;
cd charts && helmfile apply;
