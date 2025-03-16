const axios = require('axios');

// Your Hugging Face access token
const HF_TOKEN = process.env.HF_TOKEN;  // Store your token in .env for security

const modelName = 'codellama/CodeLlama-7b-hf';  // Use the Code Llama model

async function postWithRetry(url, data, retries = 3, delay = 2000) {
    for (let i = 0; i < retries; i++) {
        try {
            return await axios.post(url, { inputs: data },{
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

function chunkString(str, maxTokens) {
    const words = str.split(/\s+/);
    let chunks = [];
    let chunk = [];

    for (const word of words) {
        if ((chunk.join(" ").length + word.length) > maxTokens) {
            chunks.push(chunk.join(" "));
            chunk = [];
        }
        chunk.push(word);
    }
    if (chunk.length) {
        chunks.push(chunk.join(" "));
    }
    return chunks;
}

// Function to send code to Hugging Face API for review
async function getCodeReview(codeSnippet) {
    const url = `https://api-inference.huggingface.co/models/${modelName}`;
    code = JSON.stringify(codeSnippet)

    const chunks = chunkString(code, 2048);
    
    let mergedResponse = [];
    // Process each chunk separately

    let allReviews = [];
    
    for (let chunk of chunks) {
        try {
            const response = await await axios.post(url, 
                JSON.stringify({ inputs: chunk }),  // Ensure JSON string format
                {
                    headers: { 
                        'Authorization': `Bearer ${HF_TOKEN}`,
                    }
                }
            );

            if (response.data) {
                allReviews.push(response.data);
            }
        } catch (error) {
            console.error("Error processing chunk:", error.message, error.response?.data);
        }
    }

    // for (const chunk of chunks) {
    //     try {
    //         const response = await postWithRetry(url, chunk);
    //         // const response = await axios.post(url, {
    //         //     inputs: chunk
    //         // });

    //         // Assuming response.data contains review comments or suggestions
    //         if (response.data) {
    //             mergedResponse.push(response.data);
    //         }
    //     } catch (error) {
    //         console.error("Error processing chunk:", error);
    //         mergedResponse.push({ error: "Failed to process chunk" });
    //     }
    // }
    console.log("5")
    // Combine all responses into a single string or object
    return {
        success: true,
        review: mergedResponse.flat() // Flatten array in case responses are nested
    };
}

module.exports = { getCodeReview };
