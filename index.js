const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//1999rukonjubd

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://courier-service:1999rukonjubd@cluster0.c4wgp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run () {
    try{
        await client.connect();
        const database = client.db('courier-service');
        const serviceCollection = database.collection('services');
        const orderCollection = database.collection('orders')
        // load data from clint
        app.post('/services', async(req, res) =>{
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            res.json(result);
        });

        // get data from server
        app.get('/services', async(req, res) =>{
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services); 
        });


        // find a service
        app.get('/services/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)}
            const service = await serviceCollection.findOne(query)
            res.send(service);
        })
        // post orders to server
        app.post('/orders', async(req, res) =>{
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.json(result);
        })
        // get orders from server
        app.get('/orders', async(req, res) =>{
            const cursor = orderCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders)
        })

    }
    finally{
        // await client.close();
    }
} 
run().catch(console.dir);

app.get('/', (req, res) =>{
    res.send('Courier server is running')
});

app.listen(port, ()=>{
    console.log(`Running URL: http//:localhost:${port}`)
})