const { Kafka } = require('kafkajs');
const { brokers, totalMessages } = require("./config")

const kafka = new Kafka({
  clientId: 'my-producer',
  brokers
});

const threadId = 1

const producer = kafka.producer();
const produceMessages = async () => {
  await producer.connect();

  for (let i = 0; i <= totalMessages; i++) {
    await producer.send({
      topic: 'my-topic',
      messages: [
        {
          value: `Message ${i} from Thread ${threadId}`,
        },
      ],
      
    });

    if (i % 1000 === 0 && i > 0) {
      console.log(`Thread ${threadId} produced ${i} messages`);
    }
  }

  await producer.disconnect();
};

produceMessages().catch((error) => console.error(`Thread ${threadId} error:`, error));

