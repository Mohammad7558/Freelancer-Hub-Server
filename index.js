const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

// Assignment-10
// nrcRVLdVIJAcdeeT


const uri = "mongodb+srv://Assignment-10:nrcRVLdVIJAcdeeT@my-user.d2otqer.mongodb.net/?retryWrites=true&w=majority&appName=my-user";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();

        const taskCollection = client.db('AllTasks').collection('tasks');

        app.post('/allTasks', async (req, res) => {
            const task = req.body;
            const result = await taskCollection.insertOne(task);
            res.send(result);
        });

        app.get('/allTasks', async (req, res) => {
            const result = await taskCollection.find({}).sort({ deadline: -1 }).limit(6).toArray();
            res.send(result);
        });

        app.get('/browseTask/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await taskCollection.findOne(query);
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (error) {
        console.error(error);
    }
    // DO NOT close client here, keep connection alive
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello world')
})

app.listen(port, () => {
    console.log(`port is running on ${port}`)
})