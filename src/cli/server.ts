/**
 * Dev server with live-reload
 */

import { createServer, IncomingMessage, ServerResponse } from 'http';
import { readFileSync } from 'fs';

interface ServerOptions {
  port: number;
  outputPath: string;
}

const liveReloadScript = `
<script>
  // Simple live-reload client
  (function() {
    let retryCount = 0;
    const maxRetries = 10;

    function connect() {
      const ws = new WebSocket('ws://localhost:__PORT__/__ws');

      ws.onopen = () => {
        console.log('[wiremd] Connected to live-reload server');
        retryCount = 0;
      };

      ws.onmessage = (event) => {
        if (event.data === 'reload') {
          console.log('[wiremd] Reloading...');
          window.location.reload();
        }
      };

      ws.onclose = () => {
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(\`[wiremd] Reconnecting... (\${retryCount}/\${maxRetries})\`);
          setTimeout(connect, 1000);
        }
      };

      ws.onerror = () => {
        ws.close();
      };
    }

    connect();
  })();
</script>
`;

const wsClients: Set<any> = new Set();

export function startServer(options: ServerOptions): void {
  const { port, outputPath } = options;

  // Simple WebSocket implementation without dependencies
  const server = createServer((req: IncomingMessage, res: ServerResponse) => {
    // Handle WebSocket upgrade
    if (req.url === '/__ws') {
      res.writeHead(426, { 'Content-Type': 'text/plain' });
      res.end('This endpoint requires WebSocket upgrade');
      return;
    }

    // Serve the HTML file
    try {
      let html = readFileSync(outputPath, 'utf-8');

      // Inject live-reload script before </body>
      const script = liveReloadScript.replace('__PORT__', String(port));
      html = html.replace('</body>', `${script}\n</body>`);

      res.writeHead(200, {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      });
      res.end(html);
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end(`Error reading file: ${outputPath}`);
    }
  });

  // Handle WebSocket upgrade manually
  server.on('upgrade', (req, socket, _head) => {
    if (req.url === '/__ws') {
      // Simple WebSocket handshake
      const key = req.headers['sec-websocket-key'];
      const hash = require('crypto')
        .createHash('sha1')
        .update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11')
        .digest('base64');

      socket.write(
        'HTTP/1.1 101 Switching Protocols\r\n' +
        'Upgrade: websocket\r\n' +
        'Connection: Upgrade\r\n' +
        `Sec-WebSocket-Accept: ${hash}\r\n` +
        '\r\n'
      );

      wsClients.add(socket);

      socket.on('close', () => {
        wsClients.delete(socket);
      });

      socket.on('error', () => {
        wsClients.delete(socket);
      });
    }
  });

  server.listen(port, () => {
    console.log(`🚀 Dev server running at http://localhost:${port}`);
    console.log(`📡 Live-reload enabled`);
    console.log(`Press Ctrl+C to stop`);
  });
}

export function notifyReload(): void {
  // Send reload message to all connected clients
  wsClients.forEach((socket) => {
    try {
      // WebSocket frame format: FIN=1, opcode=1 (text)
      const message = 'reload';
      const buffer = Buffer.alloc(2 + message.length);
      buffer[0] = 0x81; // FIN + text frame
      buffer[1] = message.length; // payload length
      buffer.write(message, 2);
      socket.write(buffer);
    } catch (error) {
      wsClients.delete(socket);
    }
  });
}
