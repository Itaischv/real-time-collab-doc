import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Routes:
import authRoutes from './routes/auth.js';
// import documentRoutes from './routes/documents.js';

// app
const app = express();
app.use(cors());
app.use(express.json());
app.use(authRoutes)
dotenv.config();

const { DB_URL, PORT } = process.env;
mongoose.connect(DB_URL)
    .then(() => console.log("DB Connected"))
    .catch(err => console.error(err));
// Routes


app.get('/', (req, res) => {
    res.send("Hello World!");
});

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
})
