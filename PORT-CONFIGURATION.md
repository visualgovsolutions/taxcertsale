# Critical Port Configuration

This document outlines the critical port configuration for the tax certificate sale application.

## Port Assignments

| Port | Service | Description |
|------|---------|-------------|
| 8081 | Backend API/GraphQL server | The main server that handles API requests, database operations, and business logic |
| 8080 | Webpack Dev Server (Frontend) | Development server for the React frontend |
| 4001 | Alternative Frontend Port | Use this port if 8080 is already in use |
| 4000 | Reserved for Legacy Testing | Do not use this port for new development |

## Configuration References

These port configurations are defined in the following files:

1. `src/config/index.ts` - Backend server port configuration (8081)
2. `webpack.config.js` - Frontend development server port (8080)
3. `package.json` - NPM scripts for running development servers

## How to Run Services

### Standard Development Setup

```bash
# Run both backend and frontend servers
npm run dev

# Run only backend server (port 8081)
npm run dev:server

# Run only frontend server (port 8080)
npm run dev:client
```

### Alternate Port Configuration

If port 8080 is already in use on your system, you can use the alternate configuration:

```bash
# Run frontend on alternate port 4001
npm run dev:client:alternate

# Run both servers with frontend on alternate port
npm run dev:alternate
```

## Proxy Configuration

The webpack dev server is configured to proxy API requests to the backend:

```javascript
// From webpack.config.js
proxy: {
  '/api': {
    target: 'http://localhost:8081',
    pathRewrite: { '^/api': '' },
    secure: false,
    changeOrigin: true,
  },
},
```

## Important Notes

1. **Do not modify** these port configurations without updating all related files
2. If you encounter the error `EADDRINUSE`, it means the port is already in use. Use the alternate configuration or change both the port and update all references
3. The backend server reads the port from environment variables first, falling back to 8081 if not specified
4. For production deployment, use environment variables to configure ports rather than changing defaults

## Troubleshooting Port Conflicts

If you experience port conflicts:

1. Check if another service is using the port: `lsof -i :8080` or `lsof -i :8081`
2. Kill the process using the port: `kill -9 <PID>`
3. Use the alternate configuration: `npm run dev:alternate`
4. Set a custom port with environment variables: `PORT=8082 npm run dev:server`
