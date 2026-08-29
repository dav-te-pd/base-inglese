// Server statico minimo per servire il repository durante i test.
//
// Non usa dipendenze: basta Node, che serve già per Playwright. Sostituisce
// il `python3 -m http.server 8955` che la suite dava per scontato, così chi
// clona il repository non deve avere anche Python.
//
//   node tests/serve.js            → http://localhost:8955/index.html
//   APP_PORT=9000 node tests/serve.js

const http = require('http');
const fs = require('fs');
const path = require('path');
const { REPO_ROOT, APP_PORT } = require('./test-env');

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.md': 'text/plain; charset=utf-8'
};

const server = http.createServer((req, res) => {
  const rel = decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '') || 'index.html';
  const file = path.join(REPO_ROOT, rel);
  // Nessun accesso fuori dal repository.
  if (!file.startsWith(REPO_ROOT + path.sep) && file !== REPO_ROOT) {
    res.writeHead(403).end('Forbidden');
    return;
  }
  fs.readFile(file, (err, body) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found: ' + rel);
      return;
    }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream' });
    res.end(body);
  });
});

server.listen(Number(APP_PORT), () => {
  console.log('base-inglese servito su http://localhost:' + APP_PORT + '/index.html');
});
