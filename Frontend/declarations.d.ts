declare module '*.css';

declare namespace NodeJS {
    interface ProcessEnv {
        REACT_APP_API_URL: string;
        REACT_APP_ACCESS_TOKEN_IDENTIFIER: string;
        REACT_APP_REFRESH_TOKEN_IDENTIFIER: string
    }
}

declare var process: {
    env: NodeJS.ProcessEnv;
};
