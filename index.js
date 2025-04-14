// Core modules and dependencies
const path = require('path');
const express = require('express');
const app = express();
const port = process.env.port || 8080;

// MongoDB setup
const { MongoClient, ObjectId } = require("mongodb");
const uri = "mongodb://databaseAdmin:password@127.0.0.1:27017/StoryDatabase?authSource=admin";
const client = new MongoClient(uri);

// XSS protection and security headers
const xss = require('xss');
const helmet = require('helmet');

// Set security headers using Helmet
app.use(helmet.contentSecurityPolicy({
	directives: {
		defaultSrc: ["'self'"],
		scriptSrc: ["'self'", "http://cdn.jsdelivr.net"],
		styleSrc: ["'self'", "https://cdn.jsdelivr.net"],
	}
}));

let db;

// Connect to MongoDB and start the Express server
async function run() {
	try {
		await client.connect();
		db = client.db("StoryDatabase");
		console.log("Connected to server and database");

		app.listen(port, '0.0.0.0', () => {
			console.log(`Server running on http://localhost:${port}`);
		});
	} catch (err) {
		console.log("Connection error:", err);
	}
}
run();

// Set view engine and middleware for serving static files and parsing form data
app.set('view engine', 'ejs');
app.use(express.static('views'));
app.use(express.urlencoded({ extended: true }));

// Home route – display all stories
app.get('/', async (req, res) => {
	try {
		const stories = await db.collection('stories').find({}).toArray();
		res.render('pages/myWebPage.ejs', { stories }); // Pass stories to homepage
	} catch (err) {
		console.error('Error fetching stories:', err);
		res.status(500).send('Error fetching stories');
	}
});

// Render the post submission page
app.get('/post', (req, res) => {
	res.render('pages/PostPage.ejs');
});

// Handle story submissions
app.post('/submit-story', async (req, res) => {
	// Sanitize inputs
	const name = xss(req.body.name.trim() || 'Anonymous');
	const story = xss(req.body.story?.trim() || '');
	const genre = req.body.genre || 'Unspecified';
	const title = xss(req.body.title.trim() || story.slice(0, 10) + '...');

	// Basic validation
	if (!story || story.length === 0) {
		return res.status(400).send(`
			<h2>Error: Story cannot be empty!</h2>
			<a href="/post">Go back and write something!</a>
		`);
	}

	// Limit to 500 words
	const wordCount = story.split(/\s+/).length;
	if (wordCount > 500) {
		return res.status(400).send(`
			<h2>Error: Story is too long! (Max 500 words, you entered ${wordCount})</h2>
			<a href="/post">Go back and shorten it</a>
		`);
	}

	// Create and insert story object
	const storyData = {
		name: name,
		story: story,
		genre,
		title: title,
		rating: [],
	};

	try {
		await db.collection('stories').insertOne(storyData);
		console.log(`Story saved to database by: ${name}`);
		res.send(`<h2>Thanks, ${name}!</h2><p>Your story was saved.</p><a href="/post">Submit another</a>`);
	} catch (err) {
		console.error("Error saving story:", err);
		res.status(500).send("Error saving your story. Please try again.");
	}
});

// Display a specific story by its ID
app.get('/story/:id', async (req, res) => {
	const id = req.params.id;

	// Validate ObjectId format
	if (!ObjectId.isValid(id)) {
		return res.status(400).send('Invalid story ID format');
	}

	try {
		const story = await db.collection('stories').findOne({ _id: new ObjectId(id) });

		if (!story) return res.status(404).send('Story not found.');

		// Calculate average rating
		let avgRating = null;
		if (story.rating && story.rating.length > 0) {
			const total = story.rating.reduce((sum, r) => sum + r, 0);
			avgRating = total / story.rating.length;
		}

		// Render the story with rating info
		res.render('pages/story.ejs', {
			story,
			avgRating
		});
	} catch (err) {
		console.error('Error fetching story:', err);
		res.status(500).send('Error fetching story.');
	}
});

// Handle rating submission for a story
app.post('/rate/:id', async (req, res) => {
	const id = req.params.id;

	if (!ObjectId.isValid(id)) {
		return res.status(400).send('Invalid story ID format');
	}

	// Parse and validate the rating
	const rating = parseInt(req.body.rating);
	if (isNaN(rating) || rating < 1 || rating > 5) {
		return res.status(400).send('Invalid rating');
	}

	try {
		// Push new rating to story's rating array
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

// Fallback for undefined routes
app.use((req, res) => {
	res.status(404).send('404 - Page Not Found');
});
