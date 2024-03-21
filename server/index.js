// Task 2: Creating backend
// Task 5: Create delete method, that receives id as query parameter (e.g., http://localhost:3001/delete/1).
// Task 6: Creating a separate module for managing database connection and executing query

require('dotenv').config();
//console.log(process.env);
const express = require('express');
const cors = require('cors');
//const { Pool } = require('pg');
const { query } = require('./helpers/db.js');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const port = process.env.PORT; //const port = 3001;

// Get all tasks
app.get("/", async (req, res) => {
    console.log(query);
    try {
        const result = await query('SELECT * FROM task');
        console.log(result);
        const rows = result.rows || [];
        if (Array.isArray(rows)) { // Verify if rows is an array
            res.status(200).json(rows);
        } else {
            throw new Error("Unexpected result format");
        } 
    } catch (error) {
        console.error(error);
        res.statusMessage = error.message;
        res.status(500).json({error: error.message});
    }
});

// Add a new task
app.post("/new", async (req, res) => {
    try {
        const result = await query('INSERT INTO task (description) VALUES ($1) RETURNING *', [req.body.description]);
        res.status(200).json({ id: result.rows[0].id });
    } catch (error) {
        console.error(error);
        res.status(500).json({error: error.message});
    }
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Delete a task by ID
app.delete("/delete/:id", async (req, res) => {
    const id = Number(req.params.id);
    try {
        const result = await query('DELETE FROM task WHERE id = $1', [id]);
        res.status(200).json({ id: id });
        } catch (error) {
        console.log(error);
        res.status(500).json({error: error.message});
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});