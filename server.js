const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();

// Database Setup
const db = new sqlite3.Database('./focuslock.db');

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS sessions (id INTEGER PRIMARY KEY, duration INTEGER, status TEXT, date DATETIME)");
});

app.use(express.json());
app.use(express.static('public'));

// Save Session Endpoint
app.post('/api/sessions', (req, res) => {
    const { duration, status } = req.body;
    db.run("INSERT INTO sessions (duration, status, date) VALUES (?, ?, ?)", 
        [duration, status, new Date().toISOString()], 
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Session saved" });
        }
    );
});

// Get Stats Endpoint
app.get('/api/stats', (req, res) => {
    db.all("SELECT * FROM sessions ORDER BY date DESC", [], (err, rows) => {
        res.json(rows);
    });
});

app.listen(3000, () => console.log('FocusLock running on http://localhost:3000'));