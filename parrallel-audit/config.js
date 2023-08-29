require('./compressions')

module.exports = {
    brokers: ['localhost:9093', 'localhost:9092'],
    totalMessages: 1000000,
    batchSize: 1000
 }