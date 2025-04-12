//const http = require('http');
//const fs = require('fs');
const path = require('path');
const express = require('express');
//const session = require('express-session');

const app = express();

//const hostname = '127.0.0.1';
const port = 8080;

app.set('view engine', 'ejs');
app.use(express.static('Frontend'));
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
	res.render('pages/myWebPage.ejs')
});

app.listen(port, () => {
	console.log('Server running on http://localhost:${port}')
});
/*
const server = http.createServer((req, res) => {
    if (req.url === '/') {
        fs.readFile(path.join(__dirname, '/pages/myWebPage.ejs'), (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
*/
