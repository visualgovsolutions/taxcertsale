declare const testConfig: {
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
    test: {
        timeout: number;
    };
};
export default testConfig;
