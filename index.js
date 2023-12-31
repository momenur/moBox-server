const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

// Middleware
// app.use(cors());
// app.use(express.json());
const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
}

app.use(cors(corsOptions))
app.use(express.json());




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vrpqnh1.mongodb.net/?retryWrites=true&w=majority`;

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
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const productsCollection = client.db("moboxDB").collection("products");
        const ordersCollection = client.db("moboxDB").collection("orders");
        const usersCollection = client.db("moboxDB").collection("users");

        // Product Collection
        app.get("/products", async (req, res) => {
            const result = await productsCollection.find().toArray();
            res.send(result)
        })


        // Orders Collection
        app.get('/order', async (req, res) => {
            const email = req.query.email;
            if (!email) {
                res.send([]);
            }
            const query = { email: email }
            const result = await ordersCollection.find(query).toArray();
            res.send(result)
        })
        app.get('/customerOrder', async (req, res) => {
            const result = await ordersCollection.find().toArray();
            res.send(result)
        })
        app.post('/order', async (req, res) => {
            const item = req.body;
            const result = await ordersCollection.insertOne(item);
            res.send(result)
        })

        app.delete('/order/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            res.send(result)
        })

        //   Users Collection
        app.get('/users', async (req, res) => {
            const result = await usersCollection.find().toArray();
            res.send(result)
        })
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        })



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('mobox server is Running');
})

app.listen(port, () => {
    console.log(`MoBox is running on fort: ${port}`);
})