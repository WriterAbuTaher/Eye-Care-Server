const express = require("express");
const cors = require("cors");
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());


// mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.v7xheu4.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const collectionService = client.db('eyecare').collection('services');

        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = collectionService.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await collectionService.fineOne(query);
        })
    }
    catch (error) {
        console.log(error);
    }
}

run().catch(err => console.log(err));



app.get('/', (req, res) => {
    res.send('node server is running')
})

app.listen(port, () => {
    console.log(`node server running on port ${port}`);
})
