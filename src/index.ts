import "reflect-metadata"
import express from 'express';
import dotenv from 'dotenv';
import router from "./routes";
import path from 'path';

const projectPath = path.resolve('.');
dotenv.config({ path: path.resolve(projectPath, '.env') });

import { Database } from '../src/config/database';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

Database.initialize()
  .then(() => {
    console.log('Connected to SQLite database successfully!');
  })
  .catch((error) => {
    console.error('Error during Data Source initialization:', error);
  });


app.use('/', router);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});