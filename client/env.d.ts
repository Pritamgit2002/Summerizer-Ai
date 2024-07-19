export { };

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            MONGODB_SERVER_URL: string
            MONGODB_DATABASE_NAME: string
            AWS_ACCESS_KEY_ID: string
            AWS_SECRET_ACCESS_KEY_ID: string
            GOOGLE_CLIENT_ID: string
            GOOGLE_CLIENT_SECRET: string
        }
    }
}
