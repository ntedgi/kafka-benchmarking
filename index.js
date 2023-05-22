const express = require("express");
const { KafkaJs, NodeRdKafka } = require("./adapter");
const Utils = require("./utils");
const app = express();

async function runner(adapter, numMessages) {
  return await Utils.functionTimeWrapper({
    fn: async () => {
      for (let i = 0; i < numMessages; i++) {
        const message = generateRandomMessage();
        await adapter.produceSingleMessage(message);
      }
    },
  });
}

app.get("/produce/rdkafka", async (req, res) => {
  return runner(NodeRdKafka, Utils.config.TOTAL_MESSAGES);
});

app.get("/produce/kafkajs", async (req, res) => {
  return runner(KafkaJs, Utils.config.TOTAL_MESSAGES);
});


app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
