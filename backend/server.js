const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();

app.use(express.json());

const url = process.env.MONGO_URL || 'mongodb://notes-db:27017';
const client = new MongoClient(url);
let db;

async function start() {
    try {
        // Start the web server immediately so the container stays active!
        app.listen(3000, () => console.log('Backend listening on port 3000'));

        console.log('Connecting to MongoDB...');
        await client.connect();
        db = client.db('notesdb');
        console.log('Connected to MongoDB successfully');
        
        app.get('/api/notes', async (req, res) => {
            try {
                const notes = await db.collection('notes').find().toArray();
                res.json(notes);
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        });

        app.post('/api/notes', async (req, res) => {
            try {
                const result = await db.collection('notes').insertOne({
                    text: req.body.text,
                    timestamp: new Date()
                });
                res.status(201).json(result);
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        });
    } catch (error) {
        console.error('Initialization error:', error);
    }
}

start();
