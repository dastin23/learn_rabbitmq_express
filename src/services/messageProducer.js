const crypto = require('node:crypto');

const {
    getRabbitMQChannel,
} = require('../config/rabbitmq');

async function publishMessage(queue, message) {
    const channel = getRabbitMQChannel();

    await channel.assertQueue(queue, {
        durable: true,
    });

    const payload = Buffer.from(
        JSON.stringify({
            eventId: crypto.randomUUID(),
            event: message.event,
            data: message.data,
            createdAt: new Date().toISOString(),
        })
    );

    channel.sendToQueue(queue, payload, {
        persistent: true,
        contentType: 'application/json',
    });

    return {
        success: true,
        message: 'Message sent to RabbitMQ',
    };
}

module.exports = {
    publishMessage,
};