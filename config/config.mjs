import 'dotenv/config'

// import packageJson from '../package.json' assert { type: 'json' }

const config = {
  // version: packageJson.version,
  // name: packageJson.name,
  // description: packageJson.description,
  url: process.env.URL,

  static: {
    dotfiles: 'deny',
    extensions: ['html'],
    index: false,
    maxAge: '1d',
    redirect: false,
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

  clientOrigins: {
    development: process.env.DEV_ORIGIN ?? '*',
    production: process.env.PROD_ORIGIN ?? 'none',
  },

  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: process.env.PORT ?? 5000,
}

export default config
