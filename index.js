const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
const app = express()
require('dotenv').config()

app.use(cors())
app.use(express.json())
const port = process.env.PORT || 5000

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.eepi0pq.mongodb.net/?retryWrites=true&w=majority`;

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
        // Send a ping to confirm a successful connection
        const carDoctor = client.db('carDoctor').collection('carServises')
        const carDoctors =  client.db('carDoctor').collection('bookings')

        app.get('/servises',async(req,res)=>{
            const cursor = carDoctor.find()
            const result = await cursor.toArray();
            res.send(result)
        })
        app.get('/servises/:id',async(req,res)=>{
            const id = req.params.id
            const query = {_id : new ObjectId(id)}
            const options = {
                // Include only the `title` and `imdb` fields in the returned document
                projection: { _id: 0, title: 1, price:1,service_id:1,img:1 },
              };
            const result = await carDoctor.findOne(query,options)
            res.send(result)
        })
        app.get('/bookings',async(req,res)=>{
            let query = {};
            if(req.query?.email){
                query = {name: req.query.email}
            }
            const cursor = carDoctors.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })
        app.post('/bookings',async(req,res)=>{
            const bookings = req.body
            const result = await carDoctors.insertOne(bookings)
            console.log(result)
            res.send(result)
        })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('vai thik ase pera nai')
})

app.listen(port, () => {
    console.log(`cars is running in ${port}`)
})