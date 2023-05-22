const Kafka = require('node-rdkafka');
const { BROKER_HOST, BROKER_PORT, TOPIC } = require('../utils/config')

const producer = new Kafka.Producer({
    'metadata.broker.list': `${BROKER_HOST}:${BROKER_PORT}`
});

function produceSingleMessage({ message, topic = TOPIC }) {
    producer.on('event.log', (log) => {
        console.log(log);
    });

    producer.on('event.error', (err) => {
        console.error('Error producing message:', err);
        res.status(500).send('An error occurred while producing messages to Kafka.');
    });

    producer.on('ready', () => {
        producer.produce(
            topic,
            null,
            Buffer.from(JSON.stringify([message])),
            null,
            Date.now()
        );

        res.send('Messages sent to Kafka successfully!');
    });

    producer.connect();
}


module.exports = { produceSingleMessage }