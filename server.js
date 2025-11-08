import express from 'express';
import usersRouter from './routes/users.js';

const app = express();
const PORT = process.env.PORT || 3000;

//built-in JSON parser middleware

app.use(express.json());

//basic logger middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
    next();
});

//routes
app.use('/users', usersRouter);

//health
app.get('/', (req, res) => res.json({ ok:true }));

//generic error handler
app.use((err, req, res, next) => {
    console.error('ERROR:', err);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));