const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');  // Import CORS package
// Initialize the Express app
const app = express();

// Enable CORS for all routes (you can modify this to allow only specific origins)
app.use(cors());

// Middleware to parse JSON request body
app.use(bodyParser.json());

// Define the POST route at '/gpt'
app.post('/gpt', async (req, res) => {
    // Ensure the query is present in the body
    const { query } = req.body;

    if (!query) {
        return res.status(400).json({ error: `Query parameter is required` });
    }
    console.log("handling request")
    try {
        // Set up the parameters for the GPT-4o-Tiny API (replace with actual endpoint and key)
        const endpoint = 'http://api.openai.com/v1/chat/completions'; // Update if using a different endpoint for GPT-4o-Tiny
        console.log("making gpt request")
        const response = await axios.post(endpoint, {
            model: 'gpt-4o-mini', // Replace with actual model name
            messages: [
                { role: 'user', content: query}
            ],
            temperature: 0.7,  // Adjust temperature for randomness
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            }
        });

        // Send the response from the OpenAI API back to the client
        res.json({
            response: response.data.choices[0].message.content
        });
    } catch (error) {
        console.error('Error calling GPT-4 API:', error);
        res.status(500).json({ error: 'Failed to fetch from GPT-4 API' });
    }
});

// Start the server on port 3000
app.listen(3000, '0.0.0.0', () => {
    console.log('Server is running on http://0.0.0.0:3000');
});
