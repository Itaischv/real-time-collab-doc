import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

const port = 3000;

// app
const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
})
