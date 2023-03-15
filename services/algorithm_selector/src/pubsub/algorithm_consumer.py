import os
from .consumer import Consumer


class AlgorithmConsumer(Consumer):
    def __init__(self):
        algorithms_topic = os.environ["ALGORITHMS_TOPIC"]
        algorithms_queue = os.environ["ALGORITHMS_QUEUE"]
        super().__init__(topic=algorithms_topic, exchange_type='direct', queue=algorithms_queue, exclusive=False,
                         auto_delete=False, durable=True, message_processor=self.__consume_algorithm)

    def __consume_algorithm(self, data):
        print(f"[x] Received algorithm response {data}", flush=True)
