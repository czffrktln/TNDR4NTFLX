import dotenv from 'dotenv'
dotenv.config()

import express, { Express } from 'express';
import cors from 'cors';

import login from "./routes/login"
import user from "./routes/user"
import friends from "./routes/friends"
// import movies from "./routes/movies"
import pairs from "./routes/pairs"

const app: Express = express()

app.use(express.json())
app.use(cors());
app.use('/api/login', login)
app.use('/api/user', user)
app.use('/api/friends', friends)
// app.use('/api/movies', movies)
app.use('/api/pairs', pairs)

export default app
