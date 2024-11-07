const axios = require('axios');
require('dotenv').config();

const apiKeys = [
  process.env.COHERE_API_KEY_1,
  process.env.COHERE_API_KEY_2,
  process.env.COHERE_API_KEY_3,
];

let currentKeyIndex = 0;

const getCurrentApiKey = () => apiKeys[currentKeyIndex];

// Switch to the next API key in the array
const switchApiKey = () => {
  currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
  console.log(`Switched to API key: ${currentKeyIndex + 1}`);
};

const apiClient = axios.create();

// Send a query to the Assistant API
const queryAssistantAPI = async (query) => {
  const baseUrl = process.env.COHERE_API_BASE_URL

  try {
    const response = await apiClient.post(
      baseUrl,
      { prompt: query },
      { headers: { Authorization: `Bearer ${getCurrentApiKey()}` } }
    );

    const responseText = response.data.text || response.data.generations?.[0]?.text || '';
    return responseText.trim();
  } catch (error) {
    if (error.response && error.response.status === 400) {
       console.error("Cohere API 400 Error:", error.response.data);
    } else {
       console.error(`Error fetching data from Cohere API (${endpoint}):`, error.message || error);
    }
    switchApiKey();
    return queryAssistantAPI(query, endpoint); 
 }
 
};

module.exports = { queryAssistantAPI };
