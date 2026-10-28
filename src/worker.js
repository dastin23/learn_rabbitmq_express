require('dotenv').config();

const {
    connectRabbitMQ,
} = require('./config/rabbitmq');

async function startWorker() {
    const channel = await connectRabbitMQ();

    const queue = process.env.RABBITMQ_QUEUE || 'notifications';

    await channel.assertQueue(queue, {
        durable: true,
    });

    channel.prefetch(1);

    console.log(`Worker listening to queue: ${queue}`);

    await channel.consume(
        queue,
        async (message) => {
            if (!message) {
                return;
            }

            try {
                const payload = JSON.parse(
                    message.content.toString()
                );

                console.log('Message received:', payload);

                // Tambahkan business logic di sini.
                // Contoh: mengirim notifikasi.

                channel.ack(message);
            } catch (error) {
                console.error(
                    'Message processing failed:',
                    error.message
                );

                // Jangan langsung requeue terus-menerus.
                // Pesan yang selalu gagal perlu mekanisme retry
                // dan dead-letter queue.
                channel.nack(message, false, false);
            }
        },
        {
            noAck: false,
        }
    );
}

startWorker().catch((error) => {
    console.error('Worker startup failed:', error);
    process.exitCode = 1;
});