/**
 * Dev server with live-reload
 *
 * Copyright (c) 2025 wiremd
 * Licensed under MIT License
 * https://github.com/akonan/wiremd/blob/main/LICENSE
 */

import { createServer, IncomingMessage, ServerResponse } from 'http';
import { readFileSync } from 'fs';
import { createHash } from 'crypto';

interface ServerOptions {
  port: number;
  outputPath: string;
}

const liveReloadScript = `
<style>
  /* Wiremd Live Preview UI */
  #wiremd-toolbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 8px 16px;
    display: flex;
    align-items: center;
    gap: 16px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    z-index: 9999;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 13px;
  }

  #wiremd-toolbar .logo {
    font-weight: 600;
    font-size: 14px;
  }

  #wiremd-toolbar .status {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    background: rgba(255,255,255,0.2);
    border-radius: 12px;
    font-size: 12px;
  }

  #wiremd-toolbar .status.connected {
    background: rgba(76, 175, 80, 0.3);
  }

  #wiremd-toolbar .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  #wiremd-toolbar .spacer {
    flex: 1;
  }

  #wiremd-toolbar .viewport-selector {
    display: flex;
    gap: 8px;
  }

  #wiremd-toolbar .viewport-btn {
    padding: 4px 10px;
    background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,255,255,0.3);
    border-radius: 4px;
    color: white;
    cursor: pointer;
    font-size: 11px;
    transition: all 0.2s;
  }

  #wiremd-toolbar .viewport-btn:hover {
    background: rgba(255,255,255,0.25);
  }

  #wiremd-toolbar .viewport-btn.active {
    background: rgba(255,255,255,0.35);
    border-color: rgba(255,255,255,0.5);
  }

  #wiremd-error-overlay {
    display: none;
    position: fixed;
    top: 60px;
    left: 50%;
    transform: translateX(-50%);
    max-width: 800px;
    width: 90%;
    background: #ff5252;
    color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.3);
    z-index: 10000;
    animation: slideDown 0.3s ease;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }

  #wiremd-error-overlay.show {
    display: block;
  }

  #wiremd-error-overlay h3 {
    margin: 0 0 8px 0;
    font-size: 16px;
    font-weight: 600;
  }

  #wiremd-error-overlay pre {
    background: rgba(0,0,0,0.2);
    padding: 12px;
    border-radius: 4px;
    overflow-x: auto;
    font-size: 12px;
    margin: 12px 0 0 0;
  }

  #wiremd-error-overlay .close-btn {
    position: absolute;
    top: 12px;
    right: 12px;
    background: none;
    border: none;
    color: white;
    font-size: 20px;
    cursor: pointer;
    padding: 4px 8px;
    opacity: 0.8;
    transition: opacity 0.2s;
  }

  #wiremd-error-overlay .close-btn:hover {
    opacity: 1;
  }

  #wiremd-preview-wrapper {
    margin-top: 48px;
    transition: padding 0.3s ease;
  }

  #wiremd-preview-wrapper.viewport-mobile {
    padding: 20px;
    display: flex;
    justify-content: center;
  }

  #wiremd-preview-wrapper.viewport-mobile > * {
    max-width: 375px;
    box-shadow: 0 0 20px rgba(0,0,0,0.1);
    border-radius: 8px;
    overflow: hidden;
  }

  #wiremd-preview-wrapper.viewport-tablet {
    padding: 20px;
    display: flex;
    justify-content: center;
  }

  #wiremd-preview-wrapper.viewport-tablet > * {
    max-width: 768px;
    box-shadow: 0 0 20px rgba(0,0,0,0.1);
    border-radius: 8px;
    overflow: hidden;
  }

  #wiremd-preview-wrapper.viewport-laptop {
    padding: 20px;
    display: flex;
    justify-content: center;
  }

  #wiremd-preview-wrapper.viewport-laptop > * {
    max-width: 1024px;
    box-shadow: 0 0 20px rgba(0,0,0,0.1);
    border-radius: 8px;
    overflow: hidden;
  }

  .wiremd-reload-indicator {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: rgba(102, 126, 234, 0.95);
    color: white;
    padding: 12px 20px;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    font-size: 13px;
    display: none;
    animation: fadeIn 0.3s ease;
  }

  .wiremd-reload-indicator.show {
    display: block;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>

<div id="wiremd-toolbar">
  <div class="logo">⚡ Wiremd Live</div>
  <div class="status" id="wiremd-status">
    <div class="status-dot"></div>
    <span>Connecting...</span>
  </div>
  <div class="spacer"></div>
  <div class="viewport-selector">
    <button class="viewport-btn active" data-viewport="full">Full</button>
    <button class="viewport-btn" data-viewport="laptop">💻 Laptop</button>
    <button class="viewport-btn" data-viewport="tablet">📱 Tablet</button>
    <button class="viewport-btn" data-viewport="mobile">📱 Mobile</button>
  </div>
</div>

<div id="wiremd-error-overlay">
  <button class="close-btn" onclick="this.parentElement.classList.remove('show')">×</button>
  <h3>⚠️ Render Error</h3>
  <div id="wiremd-error-message"></div>
</div>

<div class="wiremd-reload-indicator" id="wiremd-reload-indicator">
  🔄 Reloading preview...
</div>

<script>
  // Enhanced live-reload client with error handling
  (function() {
    let retryCount = 0;
    const maxRetries = 10;
    let ws = null;

    // Wrap existing content in preview wrapper
    const body = document.body;
    const wrapper = document.createElement('div');
    wrapper.id = 'wiremd-preview-wrapper';
    wrapper.className = 'viewport-full';
    while (body.firstChild && body.firstChild.id !== 'wiremd-toolbar' && body.firstChild.id !== 'wiremd-error-overlay' && body.firstChild.id !== 'wiremd-reload-indicator') {
      wrapper.appendChild(body.firstChild);
    }
    body.appendChild(wrapper);

    const statusEl = document.getElementById('wiremd-status');
    const errorOverlay = document.getElementById('wiremd-error-overlay');
    const errorMessage = document.getElementById('wiremd-error-message');
    const reloadIndicator = document.getElementById('wiremd-reload-indicator');

    // Viewport switcher
    document.querySelectorAll('.viewport-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.viewport-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const viewport = btn.dataset.viewport;
        wrapper.className = 'viewport-' + viewport;
      });
    });

    function updateStatus(connected) {
      if (connected) {
        statusEl.className = 'status connected';
        statusEl.innerHTML = '<div class="status-dot"></div><span>Connected</span>';
      } else {
        statusEl.className = 'status';
        statusEl.innerHTML = '<div class="status-dot"></div><span>Disconnected</span>';
      }
    }

    function showError(message) {
      errorMessage.textContent = message;
      errorOverlay.classList.add('show');
      setTimeout(() => {
        errorOverlay.classList.remove('show');
      }, 8000);
    }

    function connect() {
      ws = new WebSocket('ws://localhost:__PORT__/__ws');

      ws.onopen = () => {
        console.log('[wiremd] Connected to live-reload server');
        updateStatus(true);
        retryCount = 0;
      };

      ws.onmessage = (event) => {
        const data = event.data;

        if (data === 'reload') {
          console.log('[wiremd] Reloading...');
          reloadIndicator.classList.add('show');
          setTimeout(() => {
            window.location.reload();
          }, 300);
        } else if (data.startsWith('error:')) {
          const errorMsg = data.substring(6);
          showError(errorMsg);
        }
      };

      ws.onclose = () => {
        updateStatus(false);
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(\`[wiremd] Reconnecting... (\${retryCount}/\${maxRetries})\`);
          setTimeout(connect, 1000);
        } else {
          showError('Lost connection to dev server. Please restart the server.');
        }
      };

      ws.onerror = () => {
        ws.close();
      };
    }

    connect();

    // Handle page errors
    window.addEventListener('error', (event) => {
      console.error('[wiremd] Page error:', event.error);
    });
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
      const hash = createHash('sha1')
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
  sendMessageToClients('reload');
}

export function notifyError(errorMessage: string): void {
  sendMessageToClients(`error:${errorMessage}`);
}

function sendMessageToClients(message: string): void {
  // Send message to all connected clients
  wsClients.forEach((socket) => {
    try {
      // WebSocket frame format: FIN=1, opcode=1 (text)
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
