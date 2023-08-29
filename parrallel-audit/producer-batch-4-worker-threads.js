const { Kafka, CompressionTypes } = require('kafkajs');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const { brokers, totalMessages, batchSize } = require("./config")

const kafka = new Kafka({
  clientId: 'my-producer',
  brokers
});

const numThreads = 4;
const numMessagesPerThread = totalMessages / numThreads;

if (isMainThread) {
  const workerPromises = [];
  for (let i = 0; i < numThreads; i++) {
    const worker = new Worker(__filename, {
      workerData: {
        threadId: i
      },
    });

    workerPromises.push(
      new Promise((resolve, reject) => {
        worker.on('message', resolve);
        worker.on('error', reject);
        worker.on('exit', (code) => {
          if (code !== 0) {
            reject(new Error(`Worker ${worker.threadId} exited with code ${code}`));
          }
        });
      })
    );
  }

  Promise.all(workerPromises)
    .then(() => {
      console.log('Message production complete')
      process.exit(0)
    })
    .catch((error) => console.error('Error producing messages:', error));
} else {
  const { threadId } = workerData;

  const producer = kafka.producer();

  const produceMessages = async () => {
    await producer.connect();
    for (let i = 0; i <= numMessagesPerThread / batchSize; i++) {
      const batch = [];
      for (let j = 0; j < batchSize; j++) {
        batch.push({
          value: `Message ${j} from Thread ${threadId}`,
        });
      }
      await producer.send({
        topic: 'my-topic',
        messages: batch,
        compression:CompressionTypes.Snappy
      });
      console.log(`Thread ${threadId} produced ${i * batchSize} messages`);
    }

    await producer.disconnect();
    parentPort.postMessage(`Thread ${threadId} finished`);
  };

  produceMessages().catch((error) => console.error(`Thread ${threadId} error:`, error));
}

