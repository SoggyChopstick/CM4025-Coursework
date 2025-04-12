const path = require('path');
const express = require('express');
//const session = require('express-session');

const app = express();

const port = 8080;

app.set('view engine', 'ejs');
app.use(express.static('Frontend'));
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
	res.render('pages/myWebPage.ejs')
});

app.use((req, res) => {
    res.status(404).send('404 - Page Not Found');
  });

app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
