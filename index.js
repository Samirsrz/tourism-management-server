const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;




//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2aarqjz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;



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
    // Send a ping to confirm a successful connection

           const spotCollection = client.db('touristSpot').collection('spots');


           const countryCollection = client.db('countryDB').collection('name');




     app.get('/countryAll', async(req, res)=> {
        const cursor = countryCollection.find();
        const result = await cursor.toArray();
        res.send(result);
     })


     app.get('/country/:country', async(req, res)=>{
        const countri = req.params.country;
       const filter = {countryName:countri}
       console.log(countri)
        const result = await spotCollection.find(filter).toArray()
        res.send(result);
        console.log(result)
      })


     app.get('/addSpot', async(req, res)=> {
        const cursor = spotCollection.find();
        const result = await cursor.toArray();
        res.send(result);

     })

     app.get('/addSpot/:id', async(req,res) => {
        const id = req.params.id;
        const query = {_id : new ObjectId(id)};
        const result = await spotCollection.findOne(query)
          res.send(result); 
    
    })


     app.get('/myList/:email', async(req,res) => {
        const reqEmail = req.params.email;
       console.log(reqEmail);
       const query = {email :reqEmail };
       const result  = await spotCollection.find(query).toArray();
       res.send(result);

    
    })


        app.delete('/myList/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id : new ObjectId(id)}
            const result = await spotCollection.deleteOne(query);
            res.send(result);
            console.log(id);
        })


      app.post('/addSpot', async(req,res) => {
        const newSpot = req.body;
        console.log(newSpot);
        const result = await spotCollection.insertOne(newSpot);
        res.send(result);
      })

   
      app.put('/addSpot/:id', async(req,res) =>{
          const id = req.params.id;
          const filter = {_id : new ObjectId(id)};
          const options = {upsert: true};
       
          const updatedSpot = req.body;

          const sentSpot = {
               $set: {
                
                touristSpotName : updatedSpot.touristSpotName, 
                countryName : updatedSpot.countryName , 
                location : updatedSpot.location, 
                description: updatedSpot.description, 
                averageCost: updatedSpot.averageCost,
                seasonality: updatedSpot.seasonality,
                travelTime: updatedSpot.travelTime, 
                totalVisitors: updatedSpot.totalVisitors,
                 photo: updatedSpot.photo


               }


          } 


          const result = await spotCollection.updateOne(filter, sentSpot, options);
          res.send(result);

      })
     




    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);















app.get('/', (req,res) => {
    res.send('Tourism management is running');
})
app.listen(port, ()=> {
  console.log(`Coffee server is running on ${port} `);
})