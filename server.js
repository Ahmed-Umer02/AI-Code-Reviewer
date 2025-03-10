const express = require('express');
const bodyParser = require('body-parser');
const webhookController = require('./src/controllers/webhookController');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('AI Code Reviewer is running!');
});

// Webhook route for handling pull request events
app.post('/webhook', async (req, res) => {
    try {
        const event = req.body;

        // Handle pull request events specifically
        if (event.action === 'opened' || event.action === 'synchronize') {
            const result = await webhookController.handlePullRequest(event);

            if (result.success) {
                res.status(200).send('Pull request review successful');
            } else {
                res.status(500).send(`Error: ${result.error}`);
            }
        } else {
            res.status(400).send('Invalid event');
        }
    } catch (error) {
        console.error('Error processing webhook:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
