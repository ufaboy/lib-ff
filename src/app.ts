import * as path from 'path';
import * as fs from 'fs';
import AutoLoad, { AutoloadPluginOptions } from '@fastify/autoload';
import { FastifyPluginAsync } from 'fastify';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export type AppOptions = {
  http2?: boolean,
  logger?: boolean,
  https?: Object,
  bodyLimit?: number
} & Partial<AutoloadPluginOptions>;

// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = process.env.NODE_ENV === 'production' ? {
  http2: true,
  https: {
    allowHTTP1: true,
    key: fs.readFileSync(`${process.env.CERT_DIR}/privkey.pem`),
    cert: fs.readFileSync(`${process.env.CERT_DIR}/fullchain.pem`)
  },
  bodyLimit: 20971520
  
} : {};

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts
): Promise<void> => {
  // Place here your custom code!

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  void fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: opts,
    forceESM: true,
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  void fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    // options: opts,
    options: {...opts, prefix: '/api'},
    forceESM: true,
  });
};

export default app;
export { app, options };
