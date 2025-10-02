require('dotenv').config();
const express = require('express');
const usersRoutes = require('./routes/users');
const { poolPromise } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/users', usersRoutes);

app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});
    
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
});

//server run with checking database running
poolPromise
.then(() => {
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
})
.catch(err => {
    console.error('Failed to start server due to DB connection error', err);
    process.exit(1);
});