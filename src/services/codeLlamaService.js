const axios = require('axios');

// Your Hugging Face access token
const HF_TOKEN = process.env.HF_TOKEN;  // Store your token in .env for security

const modelName = 'codellama/CodeLlama-7b-hf';  // Use the Code Llama model

async function postWithRetry(url, data, retries = 3, delay = 2000) {
    for (let i = 0; i < retries; i++) {
        try {
            return await axios.post(url, data,{
                headers: {
                    'Authorization': `Bearer ${HF_TOKEN}`,
            }});
        } catch (error) {
            if (error.response?.status === 504 && i < retries - 1) {
                console.warn(`Retrying request (${i + 1}/${retries})...`);
                await new Promise(res => setTimeout(res, delay * (i + 1)));
            } else {
                throw error;
            }
        }
    }
}

// Function to send code to Hugging Face API for review
async function getCodeReview(codeSnippet) {
    const url = `https://api-inference.huggingface.co/models/${modelName}`;
    const chunkSize = 2048; // Approx. 4096 tokens
    const chunks = [];
    code = JSON.stringify(codeSnippet)

    for (let i = 0; i < 10000; i += chunkSize) {
        chunks.push(code.substring(i, i + chunkSize));
    }
    
    let mergedResponse = [];
    // Process each chunk separately
    for (const chunk of chunks) {
        try {
            const response = await postWithRetry(url, chunk);
            // const response = await axios.post(url, {
            //     inputs: chunk
            // });

            // Assuming response.data contains review comments or suggestions
            mergedResponse.push(response.data);
        } catch (error) {
            console.error("Error processing chunk:", error);
            mergedResponse.push({ error: "Failed to process chunk" });
        }
    }
    console.log(mergedResponse, "5")
    // Combine all responses into a single string or object
    return {
        success: true,
        review: mergedResponse.flat() // Flatten array in case responses are nested
    };
}

module.exports = { getCodeReview };
