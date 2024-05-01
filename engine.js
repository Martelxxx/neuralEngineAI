const OpenAI = require('openai');
const LocalStorage = require('node-localstorage').LocalStorage;
require('dotenv').config();
const Answer = require('./models/answer');
const express = require('express');
const bodyParser = require('body-parser');
const { get } = require('jquery');
const app = express();

app.use(bodyParser.urlencoded({extended: true}));


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const localStorage = new LocalStorage('./scratch');


//=================================================

// Memory Retrieval //
let data = localStorage.getItem('memory'); // Get the memory from the local storage
let memory = data ? JSON.parse(data) : []; // Parse the memory from JSON

app.post('/demo', async (req, res) => {
    const userMessage = req.body.question; // Get the user's question from the request body
    const response = await getResponse(userMessage); // Pass the user's question to getResponse
    res.redirect('/demo');
});    

async function getResponse(userMessage) {
    memory.push({role: 'user', content: userMessage}); // Add the new user message to the memory

    const response = await openai.chat.completions.create({ // Get the assistant's response
        model: 'gpt-3.5-turbo',
        messages: memory,
        max_tokens: 100
    });
 
    const answer = response.choices[0].message.content; // Get the assistant's response from the API response
    console.log(answer); 

    // Memory Storage //    
    memory.push({role: 'assistant', content: answer}); // Add the assistant's response to the memory
    localStorage.setItem('memory', JSON.stringify(memory)); // Save the memory to the local storage

    return response;
}

app.get('/', (req, res) => {
    const lastResponse = memory.length > 0 ? memory[memory.length - 1].content : '';
    res.send(lastResponse);
});

app.get('/demo', (req, res) => {
    const lastResponse = memory.length > 0 ? memory[memory.length - 1].content : '';
    res.render('demo.ejs', {answer: lastResponse});
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});