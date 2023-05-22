const BROKER_HOST = process.env.BROKER_HOST || 'kafka-bootstrap.ua-dev.us-east-1.ironsrc.mobi'
const BROKER_PORT = process.env.BROKER_PORT || '32100'
const TOPIC = process.env.TOPIC || 'audit-log'
const SERVER_PORT = process.env.SERVER_PORT || 3000
const TOTAL_MESSAGES = process.env.TOTAL_MESSAGES || 1_000_000

module.exports = {
    BROKER_HOST,
    BROKER_PORT,
    TOPIC,
    SERVER_PORT,
    TOTAL_MESSAGES
}

