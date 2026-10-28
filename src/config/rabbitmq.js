const amqp = require('amqplib');

let connection;
let channel;

async function connectRabbitMQ() {
    if (channel) {
        return channel;
    }

    connection = await amqp.connect(process.env.RABBITMQ_URL);

    connection.on('error', (error) => {
        console.error('RabbitMQ connection error:', error.message);
    });

    connection.on('close', () => {
        console.warn('RabbitMQ connection closed');

        connection = null;
        channel = null;
    });

    channel = await connection.createChannel();

    console.log('RabbitMQ connected successfully');

    return channel;
}

function getRabbitMQChannel() {
    if (!channel) {
        throw new Error('RabbitMQ channel is not initialized');
    }

    return channel;
}

module.exports = {
    connectRabbitMQ,
    getRabbitMQChannel,
};