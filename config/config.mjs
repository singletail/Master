import process from 'node:process'
import 'dotenv/config'

// import packageJson from '../package.json' assert { type: 'json' }

const config = {
    url: process.env.URL,
    salt: process.env.SALT,

    static: {
        dotfiles: 'deny',
        extensions: ['html'],
        index: false,
        maxAge: '1d',
        redirect: false,
    },

    cors: {
        origin: ['http://n0.tel', 'http://*.n0.tel', 'ws://n0.tel'],
        //origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'X-Requested-With',
            'Accept',
            'Origin',
        ],
    },

    client: {
        dotfiles: 'deny',
        extensions: ['html'],
        index: false,
        maxAge: '1d',
        redirect: false,
    },

    db: {
        uri: process.env.MONGO_DB_URI,
    },

    log: {
        file: process.env.LOG_FILE,
    },

    openai: {
        key: process.env.OPENAI_KEY,
    },

    jwt: {
        public: process.env.JWT_PUBLIC,
        private: process.env.JWT_PRIVATE,
    },

    smtp: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
        from: process.env.EMAIL_FROM,
    },

    nodeEnv: process.env.NODE_ENV ?? 'development',
    port: process.env.PORT ?? 5000,
}

export default config
