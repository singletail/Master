require('dotenv').config();
const packageJson = require('../package.json');

const config = {
  version: packageJson.version,
  name: packageJson.name,
  description: packageJson.description,
  url: process.env['URL'],

  static: {
    dotfiles: 'deny',
    extensions: ['html'],
    index: false,
    maxAge: '1d',
    maxAge: '1d',
    redirect: false,
  },

  openai: {
    key: process.env['OPENAI_KEY'],
  },

  jwt: {
    public: process.env['JWT_PUBLIC'],
    private: process.env['JWT_PRIVATE'],
  },

  clientOrigins: {
    development: process.env['DEV_ORIGIN'] ?? '*',
    production: process.env['PROD_ORIGIN'] ?? 'none',
  },

  nodeEnv: process.env['NODE_ENV'] ?? 'development',
  port: process.env['PORT'] ?? 5000,
};

module.exports = config;
