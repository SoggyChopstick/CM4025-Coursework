const path = require('path');
const express = require('express');
//const session = require('express-session');
const app = express();
const port = 8080;

const { MongoClient, ObjectId } = require("mongodb")
const uri = "mongodb://myUserAdmin:password@mongodb://127.0.0.1:27017"
const client = new MongoClient(uri);

const xss = require('xss');
const helmet = require('helmet');
app.use(helmet.contentSecurityPolicy({
	directives: {
		defaultSrc: ["'self'"],
		scriptSrc: ["'self'", "http://cdn.jsdelivr.net"],
		styleSrc: ["'self'", "https://cdn.jsdelivr.net"],
	}
}));

let db;

async function run() {
try{
	await client.connect();
	await client.db("StoryDatabase");
    db = client.db("StoryDatabase");
	console.log("Connected to server and database stuff");
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });    
} catch (err) {
    console.log("connection error", err);
    }
}
run();

app.set('view engine', 'ejs');
app.use(express.static('views'));
app.use(express.urlencoded({extended: true}));

app.get('/', async  (req, res) => {
    try {
        const stories = await db.collection('stories').find({}).toArray();
	    res.render('pages/myWebPage.ejs', { stories });
    } catch (err) {
        console.error('Error fetching stories', err);
        res.status(500).send('Error fetching stories');
    }   

});

app.get('/post', (req, res) => {
	res.render('pages/PostPage.ejs')
});

app.post('/submit-story', async (req, res) => {
    const name = xss(req.body.name.trim() || 'Anonymous');
    const story = xss(req.body.story?.trim() || '');
    const genre = req.body.genre || 'Unspecified';
  
    if (!story || story.length === 0) {
        return res.status(400).send(`
          <h2>Error: Story cannot be empty!</h2>
          <a href="/post">Go back and write something!</a>
        `);
    }

    const wordCount = story.split(/\s+/).length;
    if (wordCount > 500) {
    return res.status(400).send(`
      <h2>Error: Story is too long! (Max 500 words, you entered ${wordCount})</h2>
      <a href="/post">Go back and shorten it </a>
    `);
  }


    const storyData = {
        name: name,
        story: story,
        genre,
        title: story.slice(0, 10) + '...',
        rating: [],
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

app.get('/story/:id', async (req, res) => {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
        return res.status(400).send('Invalid story ID format');
    }

    try {
      const story = await db.collection('stories').findOne({ _id: new ObjectId(id) });
  
      if (!story) return res.status(404).send('Story not found.');
  
      let avgRating = null;
      if (story.rating && story.rating.length > 0) {
	const total = story.rating.reduce((sum, r) => sum + r, 0);
	avgRating = total / story.rating.length;
      }
      
      res.render('pages/story.ejs', { 
        story,
        avgRating
      });
    
    } catch (err) {
      console.error('Error fetching story:', err);
      res.status(500).send('Error fetching story.');
    }
});

app.post('/rate/:id', async (req, res) => {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
        return res.status(400).send('Invalid story ID format');
    }
    
    const rating = parseInt(req.body.rating);
    
    if (isNaN(rating) || rating < 1 || rating > 5) {
      return res.status(400).send('Invalid rating');
    }
  
    try {
      await db.collection('stories').updateOne(
        { _id: new ObjectId(id) },
        { $push: { rating: rating } }
      );
  
      res.redirect(`/story/${id}`);
    } catch (err) {
      console.error('Error saving rating:', err);
      res.status(500).send('Error saving rating.');
    }
});

app.use((req, res) => {
    res.status(404).send('404 - Page Not Found');
  });
