import http from 'http';
import { app } from '../app'; // Import the fully initialized app
import request from 'supertest';

let server: http.Server | undefined;
let agent: request.SuperAgentTest | undefined;
let sockets = new Set<import('net').Socket>();

export const startTestServer = async (): Promise<{ server: http.Server; agent: request.SuperAgentTest }> => {
  if (server && agent) {
    // Server already running, return existing instance
    return { server: server!, agent: agent! };
  }

  return new Promise((resolve, reject) => {
    server = http.createServer(app).listen((err?: Error) => { // Listen on random available port
      if (err) {
        return reject(err);
      }
      sockets = new Set();
      server!.on('connection', (socket) => {
        sockets.add(socket);
        socket.on('close', () => sockets.delete(socket));
      });
      server!.unref();
      agent = request.agent(server!); // Create supertest agent bound to the server
      console.log(`Test server started on port ${(server!.address() as any).port}`);
      resolve({ server: server!, agent: agent! });
    });
  });
};

export const stopTestServer = async (): Promise<void> => {
  if (typeof (process as any)._getActiveHandles === 'function') {
    const handles = (process as any)._getActiveHandles();
    console.log('[TestServer] Open handles before close:', handles.map((h: any) => h.constructor.name));
  }
  return new Promise((resolve, reject) => {
    if (server) {
      if (!(server as any).listening) {
        console.warn('Test server exists but is not listening.');
        server = undefined;
        agent = undefined;
        sockets.clear();
        return resolve();
      }
      console.log('Attempting to close test server...');
      server.close((err?: Error) => {
        for (const socket of sockets) {
          try { socket.destroy(); } catch (e) { /* ignore */ }
        }
        sockets.clear();
        if (err) {
          if ((err as any).code === 'ERR_SERVER_NOT_RUNNING') {
            console.warn('Test server was already stopped.');
            server = undefined;
            agent = undefined;
            return resolve();
          }
          console.error('Error closing test server:', err);
          server = undefined;
          agent = undefined;
          return reject(err);
        }
        if (typeof (process as any)._getActiveHandles === 'function') {
          const handles = (process as any)._getActiveHandles();
          console.log('[TestServer] Open handles after close:', handles.map((h: any) => h.constructor.name));
        }
        console.log('Test server stopped and references cleared.');
        server = undefined;
        agent = undefined;
        resolve();
      });
    } else {
      console.log('No test server to stop.');
      resolve(); // No server to stop
    }
  });
};

// Optional: Export agent directly if preferred
// export const testAgent = agent; 