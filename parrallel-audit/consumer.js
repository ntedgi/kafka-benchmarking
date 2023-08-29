const { Kafka ,CompressionTypes} = require('kafkajs');
const { brokers } = require("./config")
require('./compressions')
const kafka = new Kafka({
    clientId: 'my-consumer',
    brokers
});

const consumer = kafka.consumer({ groupId: 'my-group' }); // Replace with your consumer group ID

const runConsumer = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: 'my-topic', fromBeginning: true }); // Replace with the topic you want to consume

    await consumer.run({
        compression: CompressionTypes.Snappy,

        eachMessage: async ({ topic, partition, message }) => {
            console.log({
                topic,
                partition,
                offset: message.offset,
                value: message.value.toString(),
            });
        },
    });
};

runConsumer().catch((error) => console.error('Error running consumer:', error));
