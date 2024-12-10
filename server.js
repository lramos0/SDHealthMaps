const http = require('http');
const fs = require('fs');
const path = require('path');
const PORT = 30000;

const COUNTER_FILE = path.join(__dirname, 'counter.json');

const server = http.createServer((req, res) => {
    // Enable CORS for all requests
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allows requests from any origin
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Methods allowed
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Allowed headers

    if (req.url === '/api/visit-count' && req.method === 'GET') {
        console.log("Request received for visit count");

        fs.readFile(COUNTER_FILE, 'utf8', (err, data) => {
            if (err) {
                console.error("Error reading counter file:", err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Could not read counter file' }));
                return;
            }

            try {
                console.log("Raw data from file:", data); // Log raw data
                let counter = JSON.parse(data);
                counter.visits += 1;

                console.log("Updated counter:", counter); // Log updated counter

                fs.writeFile(COUNTER_FILE, JSON.stringify(counter), 'utf8', err => {
                    if (err) {
                        console.error("Error updating counter file:", err);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Could not update counter file' }));
                        return;
                    }

                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ visits: counter.visits }));
                });
            } catch (parseError) {
                console.error("Error parsing JSON data:", parseError);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Could not parse counter file' }));
            }
        });
    } else if (req.url.startsWith('/public/') || req.url === '/' || req.url === '/index.html') {
        let filePath = req.url === '/' ? '/index.html' : req.url;
        filePath = path.join(__dirname, 'public', filePath);

        const extname = path.extname(filePath);
        let contentType = 'text/html';

        switch (extname) {
            case '.js':
                contentType = 'application/javascript';
                break;
            case '.css':
                contentType = 'text/css';
                break;
        }

        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>');
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
