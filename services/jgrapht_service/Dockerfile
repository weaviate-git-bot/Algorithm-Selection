FROM arm64v8/maven:3.9.0-amazoncorretto-19 AS build
COPY /src/process /process
RUN mvn -f /process/pom.xml compile assembly:single

FROM python:3.10
COPY --from=arm64v8/amazoncorretto:19 /usr/lib/jvm/java-19-amazon-corretto /usr/lib/jvm/java-19-amazon-corretto
COPY --from=build /process/target/process.jar /process/process.jar

ENV JAVA_HOME /usr/lib/jvm/java-19-amazon-corretto
RUN update-alternatives --install /usr/bin/java java /usr/lib/jvm/java-19-amazon-corretto/bin/java 1

WORKDIR /app
COPY . .

RUN pip3 install -r requirements.txt

ENV LIBRARY_NAME=JGraphT

ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=5000

ENV RABBITMQ_USER=user
ENV RABBITMQ_PASS=pass

ENV INSTANCES_TOPIC=instances
ENV INSTANCES_PARALLEL_QUEUE=jgrapht_instances_parallel
ENV INSTANCES_PARALLEL_KEY=instances.parallel
ENV INSTANCES_SEQUENTIAL_QUEUE=jgrapht_instances_sequential
ENV INSTANCES_SEQUENTIAL_KEY=instances.sequential.jgrapht

ENV USER_METRICS_TOPIC=user_metrics
ENV NEXT_LIBRARY_TOPIC=next_library

ENV DATA_AGGREGATOR_TOPIC=data_aggregator
ENV ALGORITHMS_DATA_KEY=algorithms.data
ENV INSTANCE_FEATURES_KEY=instance.features

ENV ALGORITHM_TIMEOUT=20

CMD python3 /app/src/service.py