export let preset: string;
export let testEnvironment: string;
export let roots: string[];
export let testMatch: string[];
export let transform: {
    '^.+\\.(ts|tsx)$': string;
};
export let moduleFileExtensions: string[];
export let coverageDirectory: string;
export let collectCoverageFrom: string[];
export namespace coverageThreshold {
    namespace global {
        let branches: number;
        let functions: number;
        let lines: number;
        let statements: number;
    }
}
export let setupFilesAfterEnv: string[];
export let globals: {
    'ts-jest': {
        isolatedModules: boolean;
    };
};
