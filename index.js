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

        // get services collection
        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = collectionService.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })

        // limit 3 services
        app.get('/limit', async (req, res) => {
            const query = {}
            const result = await collectionService.find(query).sort({ $natural: -1 }).limit(3).toArray();
            res.send(result)
        })

        // add services in collection
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await collectionService.insertOne(service)
            res.send(result);
        })

        // find service with id
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await collectionService.findOne(query);
            res.send(service);
        })

        // get reviews collection
        app.get('/reviews', async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        })

        // review insert in collection
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })

        // find review with id
        app.get('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const review = await reviewCollection.findOne(query);
            res.send(review);
        })

        // review remove in collection
        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        })

        // review update in collection
        app.put('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const review = req.body;
            const option = { upsert: true }
            const query = { _id: ObjectId(id) };
            const updateReview = {
                $set: {
                    reviewText: review.reviewText
                }
            }
            const result = await reviewCollection.updateOne(query, updateReview, option);
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
