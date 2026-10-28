require('dotenv').config();

const app = require('./src/app');

const {
    connectRabbitMQ,
} = require('./src/config/rabbitmq');

const PORT = process.env.PORT || 3000;

async function startServer() {
    await connectRabbitMQ();

    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}

startServer().catch((error) => {
    console.error('Application startup failed:', error);
    process.exit(1);
});