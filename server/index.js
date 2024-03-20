// Task 2: Creating backend
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

// Create a pool outside of the openDb function
const openDb = () => {
    const pool = new Pool ({
        user: 'postgres',
        host: 'localhost',
        database: 'todo',
        password: 'abcd',
        port: 5432
    });
    return pool;
};

const app = express();
app.use(cors());
app.use(express.json());
const port = 3001;

app.get("/", (req , res) => {
    const pool = openDb (); 
    pool.query('SELECT * FROM task', (error, result) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.status(200).json(result.rows);
    });
});

app.post("/new", (req, res) => {
    const pool = openDb ();
    pool.query('INSERT INTO task (description) VALUES ($1) RETURNING *',
        [req.body.description],
        (error, result) => {
            if (error) {
                return res.status(500).json({ error: error.message });
            }
            res.status(200).json({ id: result.rows[0].id });
        }
    );
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Close database pool when the application shuts down
process.on('SIGINT', () => {
    pool.end(() => {
        console.log('Database pool has been closed.');
        process.exit(0);
    });
});
/*
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
*/
app.listen(port);
