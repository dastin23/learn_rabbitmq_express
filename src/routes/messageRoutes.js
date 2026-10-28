const express = require('express');

const {
    publishMessage,
} = require('../services/messageProducer');

const router = express.Router();

router.post('/messages', async (req, res, next) => {
    try {
        const { event, data } = req.body;

        if (!event || typeof event !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'Event is required',
            });
        }

        const result = await publishMessage(
            process.env.RABBITMQ_QUEUE || 'notifications',
            {
                event,
                data,
            }
        );

        return res.status(202).json(result);
    } catch (error) {
        next(error);
    }
});

module.exports = router;