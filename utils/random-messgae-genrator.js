const generateRandomMessage = () => {
  const key = Math.random().toString(36).substring(7);
  const value = Math.random().toString(36).substring(7);
  return { key, value };
};

module.exports = {
  generateRandomMessage,
};
