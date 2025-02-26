const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.43teffq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();
    // Send a ping to confirm a successful connection

    const spotCollection = client.db("spotDB").collection("Spots");

    app.get("/spots", async(req,res)=>{
      const cursor = spotCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    // update info
    app.get("/spots/:id", async(req,res)=>{
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await spotCollection.findOne(query);
      res.send(result);
    })

    app.put("/spots/:id", async(req,res)=>{
      const id = req.params.id;
      const filter ={_id: new ObjectId(id)};
      const options = {upsert : true};
      const updatedInfo = req.body;
      const updated = {
        $set:{
           spot : updatedInfo.spot,
           country: updatedInfo.country,
           location: updatedInfo.location,
           cost: updatedInfo.cost,
           season: updatedInfo.season,
           time: updatedInfo.time,
           visitors: updatedInfo.visitors,
           description: updatedInfo.description,
           name: updatedInfo.name,
           email: updatedInfo.email,
           photoURL: updatedInfo.photoURL,
        }
      }
      const result = await spotCollection.updateOne(filter,updated,options);
      res.send(result);
    })

    // delete spot
    app.delete("/spots/:id",async(req,res)=>{
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await spotCollection.deleteOne(query);
      res.send(result);
    })

    
    app.post("/spots",async(req,res)=>{
      const newSpot = req.body;
      console.log(newSpot);
      const result = await spotCollection.insertOne(newSpot);
      res.send(result);
    })

    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get("/", (req,res)=>{
  res.send("Tourist Management Server is running")
})
app.listen(port, ()=>{
  console.log(`Tourist Management Server running on Port : ${port}`);
})
