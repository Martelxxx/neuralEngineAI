const OpenAI = require('openai');
const LocalStorage = require('node-localstorage').LocalStorage;
require('dotenv').config();
const Answer = require('./models/answer');


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const localStorage = new LocalStorage('./scratch');


//=================================================

// Memory Retrieval //

let data = localStorage.getItem('memory'); // Get the memory from the local storage
let memory = data ? JSON.parse(data) : []; // Parse the memory from JSON

// OpenAI Chat API //

async function getResponse() {
    let userMessage = "how are you doing today"; // INPUT YOUR MESSAGE HERE!

    memory.push({role: 'user', content: userMessage}); // Add the new user message to the memory


    const response = await openai.chat.completions.create({ // Get the assistant's response
        model: 'gpt-3.5-turbo',
        messages: memory,
        max_tokens: 100
    })
 
    const answer = response.choices[0].message.content; // Get the assistant's response from the API response
    console.log(answer); 

// Memory Storage //    

memory.push({role: 'assistant', content: answer}); // Add the assistant's response to the memory
localStorage.setItem('memory', JSON.stringify(memory)); // Save the memory to the local storage

}    

getResponse();

// End of Neual Engine //