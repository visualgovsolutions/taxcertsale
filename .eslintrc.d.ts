export declare let parser: string;
declare let _extends: string[];
export { _extends as extends };
export declare let plugins: string[];
export declare namespace parserOptions {
    let ecmaVersion: number;
    let sourceType: string;
    namespace ecmaFeatures {
        let jsx: boolean;
    }
}
export declare namespace env {
    let browser: boolean;
    let node: boolean;
    let es2022: boolean;
    let jest: boolean;
}
export declare let rules: {
    semi: string[];
    quotes: string[];
    'no-console': (string | {
        allow: string[];
    })[];
    'max-len': (string | {
        code: number;
        ignoreUrls: boolean;
        ignoreStrings: boolean;
    })[];
    'react/react-in-jsx-scope': string;
    'react/prop-types': string;
    'react-hooks/rules-of-hooks': string;
    'react-hooks/exhaustive-deps': string;
    '@typescript-eslint/explicit-module-boundary-types': string;
    '@typescript-eslint/no-unused-vars': (string | {
        argsIgnorePattern: string;
    })[];
    '@typescript-eslint/no-explicit-any': string;
    '@typescript-eslint/ban-ts-comment': string;
};
export declare namespace settings {
    namespace react {
        let version: string;
    }
}
export declare let ignorePatterns: string[];
