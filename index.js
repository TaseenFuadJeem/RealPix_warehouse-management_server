const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require("express");
const app = express();
const cors = require("cors");
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());


const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@cluster0.8b6f3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {

    try {

        await client.connect();
        const camCollection = client.db("CamServer").collection("camCollection");
        console.log("Connected to db");

        app.get('/cam', async (req, res) => {

            const qr = req.query;

            const cursor = camCollection.find(qr);

            const result = await cursor.toArray();

            res.send(result);

        });

        app.get("/inventory/:id", async (req, res) => {

            const id = req.params.id;

            const q = { _id: ObjectId(id) };

            const product = await camCollection.findOne(q);

            res.send(product);
        })

        app.post('/cam', async (req, res) => {

            const newProduct = req.body;

            const result = await camCollection.insertOne(newProduct);

            res.send(result);

        })

        app.delete('/inventory/:id', async (req, res) => {

            const id = req.params.id;

            const q = { _id: ObjectId(id) };

            const result = await camCollection.deleteOne(q);

            res.send(result);

        })

        app.put('/update-product/:id', async (req, res) => {

            const id = req.params.id;

            const data = req.body;

            const filter = { _id: ObjectId(id) };

            const options = { upsert: true };

            const updatedDoc = {
                $set: data
            };

            const result = await camCollection.updateOne(filter, updatedDoc, options);

            res.send(result)
        })

        app.get('/my-items', async (req, res) => {
            const email = req.query.email;

            const qr = { email: email };

            const cursor = camCollection.find(qr);

            const result = await cursor.toArray();

            res.send(result);

        });

        app.delete('/my-items/:id', async (req, res) => {

            const id = req.params.id;

            const q = { _id: ObjectId(id) };

            const result = await camCollection.deleteOne(q);

            res.send(result);

        })

        app.put('/update-quantity', async (req, res) => {

            const id = req.params.id;

            const newQnt = req.body;

            const filter = { _id: ObjectId(id) };

            const options = { upsert: true };

            const updatedDoc = {
                $set: {
                    qnt: newQnt
                }
            };

            const result = await camCollection.updateOne(filter, updatedDoc, options);

            res.send(result)
        })

    } finally {

    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("hello world")
});

app.listen(port, () => {
    console.log("Running successfully : ", port);
})