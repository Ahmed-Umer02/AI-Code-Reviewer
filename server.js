const express = require('express');
const bodyParser = require('body-parser');
const webhookController = require('./src/controllers/webhookController');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('AI Code Reviewer is running!');
});

// Sample test route
app.post('/review', (req, res) => {
    console.log("Received request:", req.body);
    res.json({ message: "Code review started", data: req.body });
});

// Webhook route for handling pull request events
app.post('/webhook', async (req, res) => {
    try {
        const event = req.body;

        // Handle pull request events specifically
        if (["opened", "synchronize", "reopened"].includes(event.action)) {

            const result = await webhookController.handlePullRequest(event);

            if (result.success) {
                res.status(200).send('Pull request review successful');
            } else {
                res.status(500).send(`Error: ${result.error}`);
            }
        } else {
            console.warn("Missing 'action' field in webhook event:", event);
            return res.status(400).send("Missing 'action' field");
        }
    } catch (error) {
        console.error('Error processing webhook:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
