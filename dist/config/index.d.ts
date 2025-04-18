/**
 * Application Configuration
 *
 * CRITICAL PORT CONFIGURATION:
 * - Server port 8081: Backend API/GraphQL server
 * - Port 8080: Webpack dev server (frontend)
 * - Port 4000: Reserved for legacy testing
 * - Port 4001: Alternative frontend port (if 8080 is in use)
 *
 * DO NOT change these ports without updating corresponding webpack configurations
 * and ensuring no conflicts with other services during development.
 */
declare const config: {
    server: {
        port: string | number;
        nodeEnv: string;
    };
    db: {
        host: string;
        port: number;
        user: string;
        password: string;
        database: string;
        poolSize: number;
    };
    jwt: {
        secret: string;
        expiresIn: number;
        refreshExpiresIn: number;
    };
    api: {
        prefix: string;
    };
};
export default config;
