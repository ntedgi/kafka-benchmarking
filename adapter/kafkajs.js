const { Kafka } = require('kafkajs');
const { BROKER_HOST, BROKER_PORT, TOPIC } = require('../utils/config')

const kafka = new Kafka({
    clientId: 'my-kafka-producer',
    brokers: [`${BROKER_HOST}:${BROKER_PORT}`]
});

async function produceSingleMessage({ message, topic = TOPIC }) {
    try {
        const producer = kafka.producer();
        await producer.connect();
        await producer.send({
            topic,
            messages: [message]
        });
        await producer.disconnect();
        res.send('Messages sent to Kafka successfully!');
    } catch (error) {
        console.error('Error producing messages:', error);
        res.status(500).send('An error occurred while producing messages to Kafka.');
    }
}

module.exports = { produceSingleMessage }