const { Kafka } = require('kafkajs');
const { brokers, totalMessages, batchSize } = require("./config")
const kafka = new Kafka({
    clientId: 'my-producer',
    brokers
});

const threadId = 1;
const producer = kafka.producer();


function byteLength(str) {
    // returns the byte length of an utf8 string
    var s = str.length;
    for (var i=str.length-1; i>=0; i--) {
      var code = str.charCodeAt(i);
      if (code > 0x7f && code <= 0x7ff) s++;
      else if (code > 0x7ff && code <= 0xffff) s+=2;
      if (code >= 0xDC00 && code <= 0xDFFF) i--; //trail surrogate
    }
    return s;
  }

const produceMessages = async () => {
    await producer.connect();
    for (let i = 0; i <= totalMessages; i += batchSize) {
        const batch = [];
        for (let j = i; j < i + batchSize; j++) {
            batch.push({
                value: `Message ${j} from Thread ${threadId}`,
            });
        }
        await producer.send({
            topic: 'my-topic',
            messages: batch,
            
        });
        console.log(`Thread ${threadId} produced ${batch.length} messages (total: ${i})`);
    }
    await producer.disconnect();
};

produceMessages()
    .then(() => {
        console.log('Message production complete')
        process.exit(0)
    })
    .catch((error) =>
        console.error(`Thread ${threadId} error:`, error));
