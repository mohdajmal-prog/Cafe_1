const WebSocket = require('ws');

let wss;

/**
 * Initializes the WebSocket server and attaches it to the HTTP server.
 * @param {import('http').Server} server The HTTP server instance.
 */
function init(server) {
  wss = new WebSocket.Server({ server });

  wss.on('connection', ws => {
    console.log('🔌 New client connected to WebSocket.');

    ws.on('message', message => {
      // For now, we just log messages from clients.
      // This could be extended for bi-directional communication if needed.
      console.log('Received message from client:', message.toString());
    });

    ws.on('close', () => {
      console.log('🔌 Client disconnected from WebSocket.');
    });

    ws.on('error', (error) => {
      console.error('WebSocket client error:', error);
    });
  });

  console.log('🚀 WebSocket server initialized.');
}

/**
 * Broadcasts a JSON payload to all connected and ready WebSocket clients.
 * @param {object} data The data to broadcast. Must be JSON-serializable.
 */
function broadcast(data) {
  if (!wss) return;

  const message = JSON.stringify(data);
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

/**
 * Broadcasts menu updates to all connected clients.
 * @param {object} menuItem The menu item that was added/updated.
 */
function broadcastMenuUpdate(menuItem) {
  broadcast({
    type: 'MENU_UPDATE',
    data: menuItem
  });
}

module.exports = { init, broadcast, broadcastMenuUpdate };