const { Kafka } = require('kafkajs');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const { brokers, totalMessages } = require("./config")

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

    for (let i = 0; i <= numMessagesPerThread; i++) {
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
    parentPort.postMessage(`Thread ${threadId} finished`);
  };

  produceMessages().catch((error) => console.error(`Thread ${threadId} error:`, error));
}

