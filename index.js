import express from 'express';
import Router from './BACK/routes/router.js';
import path from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from './BACK/db/connection.js';
import { fileURLToPath } from 'url';
const app = express()
const port = 3000

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));

app.use(
    express.urlencoded({
        extended: true,
    })
)

app.use('/', Router)

app.listen(port, () => console.log('Server running on port' + port))