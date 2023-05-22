const { generateRandomMessage } = require("./random-messgae-genrator");
const { functionTimeWrapper } = require("./mesure");
const config = require("./config");


module.exports = {
  generateRandomMessage,
  functionTimeWrapper,
  config,
};
