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
        const reviewCollection = client.db('eyecare').collection('reviews');

        // service collection data
        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = collectionService.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })

        // find service with id
        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await collectionService.findOne(query);
            res.send(service);
        })

        // reviews data
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })
    }
    finally {

    }
}

run().catch(err => console.log(err));



app.get('/', (req, res) => {
    res.send('node server is running')
})

app.listen(port, () => {
    console.log(`node server running on port ${port}`);
})
