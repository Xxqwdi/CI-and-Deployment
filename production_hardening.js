const http = require('http');

const port = process.env.PORT || process.argv[2] || 3000;

const server = http.createServer((req, res) => {
  const baseHeaders = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'no-referrer',
    'Access-Control-Allow-Origin': '*'
  };

  try {
    if (req.method === 'OPTIONS' && req.url === '/health') {
      res.writeHead(204, baseHeaders);
      return res.end();
    }

    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200, { ...baseHeaders, 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ ok: true }));
    }

    if (req.method === 'GET' && req.url === '/boom') {
      throw new Error('Simulated fatal error');
    }

    res.writeHead(404, baseHeaders);
    res.end('Not Found');

  } catch (err) {
    if (!res.headersSent) {
      res.writeHead(500, baseHeaders);
      res.end('Internal Server Error');
    }
  }
});

server.listen(port);