const path = require('path');
const express = require('express');
//const session = require('express-session');
const app = express();
const port = 8080;

const { MongoClient } = require("mongodb")
const uri = "mongodb://127.0.0.1:27017"
const client = new MongoClient(uri);

let db;

async function run() {
try{
	await client.connect();
	await client.db("StoryDatabase");
	console.log("Connected to server and database stuff");
} catch (err) {
    console.log("connection error", err);
    }
}
run();

app.set('view engine', 'ejs');
app.use(express.static('views'));
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
	res.render('pages/myWebPage.ejs')
});

app.get('/post', (req, res) => {
	res.render('pages/PostPage.ejs')
});

app.post('/submit-story', async (req, res) => {
    const name = req.body.name.trim() || 'Anonymous';
    const story = req.body.story.trim();
    const rating = 0;
  
    const storyData = {
        name: name,
        story: story,
        rating: rating,
      };

      try {
        await db.collection('stories').insertOne(storyData); // Save to DB
        console.log(`Story saved to database by: ${name}`);
        res.send(`<h2>Thanks, ${name}!</h2><p>Your story was saved.</p><a href="/post">Submit another</a>`);
      } catch (err) {
        console.error("Error saving story:", err);
        res.status(500).send("Error saving your story. Please try again.");
      }
    });

app.use((req, res) => {
    res.status(404).send('404 - Page Not Found');
  });

app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
