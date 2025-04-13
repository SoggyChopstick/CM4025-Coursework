const path = require('path');
const express = require('express');
//const session = require('express-session');
const app = express();
const port = 8080;

app.set('view engine', 'ejs');
app.use(express.static('views'));
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
	res.render('pages/myWebPage.ejs')
});

app.get('/post', (req, res) => {
	res.render('pages/PostPage.ejs')
});

app.post('/submit-story', (req, res) => {
    const name = req.body.name.trim() || 'Anonymous';
    const story = req.body.story.trim();
  
    console.log(`New story submitted!`);
    console.log(`Author: ${name}`);
    console.log(`Story: ${story}`);
    console.log('--------------------------');
  
    res.send(`<h2>Thanks, ${name}!</h2><p>Your story was received.</p><a href="/post">Submit another</a>`);
  });  

app.use((req, res) => {
    res.status(404).send('404 - Page Not Found');
  });

app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
