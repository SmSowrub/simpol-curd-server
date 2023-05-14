const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 7000;

app.use(express.json())
app.use(cors())
// name: nazmulhasun7
// password : zhPWC3uJyKTlfHFO




const uri = "mongodb+srv://nazmulhasun7:zhPWC3uJyKTlfHFO@cluster0.msr6tud.mongodb.net/?retryWrites=true&w=majority";

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

        const database = client.db("usersDB");
        const userCollection = database.collection("users");

        app.get('/users', async (req, res)=>{
            const curser =userCollection.find()
            const result =await curser.toArray();
            res.send(result)
        })

        app.get('/users/:id', async (req, res)=>{
            const id =req.params.id;
            const query ={_id : new ObjectId(id)};
            const result =await userCollection.findOne(query)
            res.send(result)
        })

        app.put('/users/:id', async (req, res)=>{
            const id =req.params.id;
            const user=req.body
            console.log(id, user);
            const filter ={_id:new ObjectId(id)};
            const options ={upsert : true};
            const updateUsers={
                $set:{
                    name: user.name,
                    email: user.email
                }
            }
            const result =await userCollection.updateOne(filter, updateUsers, options)
            res.send(result)
        })

        app.post('/users', async (req, res) => {
            const user = req.body
            console.log(user);
            const result = await userCollection.insertOne(user);
            res.send(result)
        })
        app.delete('/users/:id', async (req, res)=>{
            const id = req.params.id
            console.log('please delete', id);
            const query = { _id: new ObjectId(id) };
            const result =await userCollection.deleteOne(query);
            res.send(result)
            
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
    res.send('Simple curd!')
})


app.listen(port, () => {
    console.log(`Simple curd running port ${port}`)
})