const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb'); 
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToDatabase(){
    try{
        await client.connect();
        console.log('Conectat la baza de date MongoDB');
        return client.db('numele_bazei_de_date'); // Schimbăm 'numele_bazei_de_date' cu numele bazei de date dorite
    }
    catch (error){
        console.error('Eroare la conectare:', error);
        throw new Error('Eroare la conectarea la baza de date');
    }
}

app.post('/register', async (req, res) => {
    const { email, username, password, occupation } = req.body;
    const db = await connectToDatabase(); 

    try {
        const usersCollection = db.collection('users');
        const result = await usersCollection.insertOne({ email, username, password, occupation });

        const responseData = {
            message: 'Utilizator înregistrat cu succes!',
            user: { email, username, occupation }
        };

        res.json(responseData);
    } catch (error) {
        console.error('Eroare la înregistrare:', error);
        res.status(500).json({ message: 'Eroare la înregistrare a utilizatorului' });
    }
});

app.listen(PORT, () => {
    console.log(`Serverul rulează la adresa http://localhost:${PORT}`);
});
