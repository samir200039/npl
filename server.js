// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const { Configuration, OpenAIApi } = require("openai");

// const app = express();
// const port = 5000;

// app.use(cors());
// // Replace 'YOUR_OPENAI_API_KEY' with your actual OpenAI API key
// const apiKey = 'sk-YGg15XrcqhK5l9CL7csdT3BlbkFJUhYoK13M0nz23tPBGps0sk-YGg15XrcqhK5l9CL7csdT3BlbkFJUhYoK13M0nz23tPBGps0';
// const configuration = new Configuration({
//   apiKey: apiKey,
// });
// const openai = new OpenAIApi(configuration);

// app.use(bodyParser.json());

// app.post('/', async (req, res) => {
//   try {
//     const { text } = req.body;

//     // Send user input to OpenAI to get the AI-generated response
//     const chatCompletion = await openai.createChatCompletion({
//       model: "text-davinci-003",
//       prompt: text,
//       max_tokens: 500, // Increase the max_tokens value for more complete responses
//     });

//     // Extract the AI-generated text from the response
//     const aiText = chatCompletion.data.choices[0].text;

//     // Construct the response to send back to the frontend
//     const response = {
//       text: aiText,
//     };

//     res.json(response);
//   } catch (error) {
//     console.error('Error fetching AI response:', error);
//     res.status(500).json({ error: 'Oops! An error occurred while processing your request.' });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const natural = require('natural');
require("dotenv").config();

const app = express();

const PORT = process.enc.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Initialize NLTK stemmer and tokenizer
const stemmer = natural.PorterStemmer;
const tokenizer = new natural.WordTokenizer();

// Sample data for the chatbot
const knowledgeBase = [
  { input: 'hi', output: 'Hello! How can I assist you?' },
  { input: 'how are you', output: 'I am doing well, thank you!' },
  { input: 'bye', output: 'Goodbye! Have a great day.' },
  { input: 'time', output: `The current time is ${new Date().toLocaleTimeString()}.` },
  { input: 'date', output: `Today's date is ${new Date().toLocaleDateString()}.` },
  { input: 'day', output: `Today is ${new Date().toLocaleDateString('en-US', { weekday: 'long' })}.` },
  { input: 'medical checkup', output: 'It is essential to have regular medical checkups to monitor your health and detect any potential issues early.' },
  { input: 'exercise', output: 'Regular exercise is beneficial for your physical and mental well-being. Aim for at least 30 minutes of moderate activity most days of the week.' },
  { input: 'hydration', output: 'Stay hydrated by drinking plenty of water throughout the day. It is recommended to drink at least 8 glasses of water daily.' },
  { input: 'balanced diet', output: 'Maintain a balanced diet that includes a variety of fruits, vegetables, whole grains, lean proteins, and healthy fats.' },
  { input: 'sleep', output: 'Ensure you get enough sleep each night. Adults generally need 7-9 hours of sleep for optimal health.' },
  { input: 'stress management', output: 'Practice stress management techniques like meditation, deep breathing, or spending time in nature to reduce stress levels.' },
  { input: 'vaccinations', output: 'Stay up-to-date with vaccinations as recommended by your healthcare provider to protect yourself and others from preventable diseases.' },
  { input: 'avoid smoking', output: 'If you smoke, consider quitting. Smoking is a leading cause of many health issues and can have serious long-term effects on your health.' },
  { input: 'alcohol moderation', output: 'If you drink alcohol, do so in moderation. Limit alcohol intake to reduce the risk of health problems.' },
  { input: 'snakes', output: 'Snakes are elongated, legless reptiles that belong to the suborder Serpentes.' },
  { input: 'snake species', output: 'There are over 3,000 known species of snakes, ranging from tiny thread snakes to massive pythons.' },
  { input: 'habitat', output: 'Snakes can be found on every continent except Antarctica. They inhabit a wide range of environments, including forests, grasslands, deserts, and even in water.' },
  { input: 'diet', output: 'Most snakes are carnivorous and primarily feed on small animals, including rodents, birds, insects, and other reptiles.' },
  { input: 'venomous snakes', output: 'Some snakes are venomous and use their venom to immobilize or kill their prey. Examples of venomous snakes include cobras, vipers, and rattlesnakes.' },
  { input: 'non-venomous snakes', output: 'The majority of snake species are non-venomous and use constriction to subdue their prey. They wrap their bodies around the prey and suffocate it.' },
  { input: 'reproduction', output: 'Snakes reproduce by laying eggs or giving birth to live young, depending on the species. Most snake species lay eggs.' },
  { input: 'importance in ecosystems', output: 'Snakes play a crucial role in ecosystems as both predators and prey. They help control populations of small animals and are a food source for many predators.' },
  { input: 'threats to snakes', output: 'Snakes face various threats, including habitat loss, pollution, and persecution by humans due to fear and misunderstanding. Several snake species are endangered or critically endangered.' },
  { input: 'conservation', output: 'Conservation efforts are in place to protect snake species and their habitats. Educating the public about the importance of snakes in ecosystems is essential for their conservation.' },
  // Add more knowledge base entries here
];


// Function to process user input and generate a response
function processUserInput(input) {
  console.log('Received input:', input);
  const tokens = tokenizer.tokenize(input.toLowerCase());
  const cleanedInput = tokens.join(' '); // Convert tokens back to a sentence
  let response = 'I am sorry, but I don\'t understand. Can you please rephrase your question?';

  knowledgeBase.forEach((knowledge) => {
    if (cleanedInput.includes(knowledge.input)) {
      response = knowledge.output;
    }
  });

  return response;
}


app.get("/ip",function(req,res){
  res.end("Your IP address is " + req.ip);
})


app.post('/api/chat', (req, res) => {
  try {
    const { text } = req.body;
    const response = processUserInput(text);

    // Construct the response to send back to the frontend
    const responseData = {
      response,
    };

    res.json(responseData);
  } catch (error) {
    console.error('Error processing user input:', error);
    res.status(500).json({ error: 'Oops! An error occurred while processing your request.' });
  }
});

app.listen(PORT, () => {
  console.log(`Chatbot server is running on http://localhost:${PORT}`);
});
