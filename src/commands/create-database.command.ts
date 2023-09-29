import { existsSync } from 'fs';
import { resolve } from 'path';
import { createDatabase, DatabaseCreateContext } from 'typeorm-extension';
import { config as configEnv } from 'dotenv';
import config from '../config/config';

const dbOption = config().database;
const appOption = config().app;

console.log('here__________', dbOption, appOption);

const { exit } = process;
const env = appOption.env || 'development';
let path = resolve(__dirname, `../../.env.${appOption.env}.local`);
const database = `${dbOption.db}${env === 'test' ? '_test' : ''}`;

if (!existsSync(path)) path = resolve(__dirname, '../../.env');

if (existsSync(path)) {
  const { error } = configEnv({ path });

  if (error) throw error;
}

const createDb = async () => {
  const contextDb: DatabaseCreateContext = {
    ifNotExist: true,
    options: {
      charset: 'utf8mb4_unicode_ci',
      type: 'mysql',
      database,
      username: dbOption.username,
      password: dbOption.password,
      host: dbOption.host,
      port: dbOption.port,
      connectTimeout: 5000,
    },
  };

  try {
    console.log(`Create Database ${database} @ ${dbOption.host}`);
    await createDatabase(contextDb);
    console.log('Successfully created!');
    exit(0);
  } catch (error) {
    console.error(error);
    exit(1);
  }
};

createDb();
