const http = require('node:http');

// Ordinary application code: no telemetry dependencies or context forwarding.
http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end('{"available":true}\n');
}).listen(8080, '0.0.0.0', () => console.log('inventory listening on 8080'));
