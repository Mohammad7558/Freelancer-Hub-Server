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


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@my-user.d2otqer.mongodb.net/?retryWrites=true&w=majority&appName=my-user`;

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
        const usersCollection = client.db('AllTasks').collection('loggedUser');
        app.post('/users', async (req, res) => {
            const userInfo = req.body;
            const result = await usersCollection.insertOne(userInfo);
            res.send(result)
        })
        app.get('/myPostedTasks/:uid', async (req, res) => {
            const uid = req.params.uid;
            const query = { uid: uid };
            const tasks = await taskCollection.find(query).toArray();
            res.send(tasks);
        });
        // update bidsCount 
        app.patch('/allTasks/:id', async (req, res) => {
            const id = req.params.id;
            const updateBidsCount = req.body.bidsCount;
            const filter = {_id: new ObjectId(id)};
            const updateDoc = {
                $set: {
                    bidsCount: updateBidsCount
                }
            }
            const result = await taskCollection.updateOne(filter, updateDoc);
            res.send(result)
        });
        // delete userAdded Tasks
        app.delete('/allTasks/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await taskCollection.deleteOne(query);
            res.send(result)
        })
        app.post('/allTasks', async (req, res) => {
            const task = req.body;
            const result = await taskCollection.insertOne(task);
            res.send(result);
        });
        app.get('/allTasks', async (req, res) => {
            const result = await taskCollection.find({}).sort({ deadline: -1 }).limit(6).toArray();
            res.send(result);
        });
        app.get('/allTasks/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await taskCollection.findOne(query)
            res.send(result);
        });
        
        // update the full user task data
        app.put('/allTasks/:id', async(req, res) => {
            const id = req.params.id;
            const newUserData = req.body;
            const query = {_id: new ObjectId(id)};
            const updateDoc = {
                $set: newUserData
            }
            const result = await taskCollection.updateOne(query, updateDoc);
            res.send(result)
        })
        app.get('/browseTask', async (req, res) => {
            const result = await taskCollection.find().toArray();
            res.send(result);
        });
        app.get('/browseTask/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
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