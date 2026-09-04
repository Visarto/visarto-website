import { createServer } from 'node:http';

/**
 * A stand-in for whatever Visarto eventually points APPOINTMENT_ENDPOINT at.
 *
 * It exists so the whole appointment journey can be exercised locally: the
 * form posts, the API forwards, this receives, and only then does the visitor
 * see a confirmation. Without it the success path is never actually run.
 */

const port = Number(process.env.DELIVERY_PORT ?? 4399);
const received = [];

createServer((request, response) => {
  if (request.method === 'POST' && request.url === '/deliver') {
    let body = '';
    request.on('data', (chunk) => {
      body += chunk;
    });
    request.on('end', () => {
      try {
        received.push(JSON.parse(body));
      } catch {
        received.push({ malformed: true });
      }
      response.writeHead(200, { 'content-type': 'application/json' });
      response.end('{"ok":true}');
    });
    return;
  }

  if (request.method === 'GET' && request.url === '/received') {
    response.writeHead(200, { 'content-type': 'application/json' });
    response.end(JSON.stringify({ count: received.length, last: received.at(-1) ?? null }));
    return;
  }

  response.writeHead(404);
  response.end();
}).listen(port, () => {
  console.log(`delivery receiver listening on ${port}`);
});
