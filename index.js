const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

// middleware

app.use(express.json());
app.use(cors({
  origin : [
     'http://localhost:3000',
     'https://prime-uni-client-repo.vercel.app'
  ]
}))


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.56yvv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

        // ! database collections
        const db = client.db('prime-uni-db');

        const userCollections = db.collection('users');
        const collegeCollections = db.collection('Colleges')
        const admissionCollections = db.collection('admission')
        const feedbackCollections = db.collection('feedbacks')


        //! ------------------- user related api

        app.post('/prime-uni/api/users',async(req,res) => {
       const newUser = req.body;
        const email = newUser.email;

        // varify user
        if(!email){
            return res.status(400).send({meassage : 'Email Is Required'})
        }

        // if User is already exist
        const existingUser = await userCollections.findOne({email});

        if(existingUser){
            return res.status(200).send({meassage : 'User Already Exist in database'})
        }

        const result = await userCollections.insertOne(newUser);
     res.send(result)
        })

        // find user

        app.get('/prime-uni/api/users',async(req,res) => {
              const result = await userCollections.find().toArray();
              res.send(result)
        })

        // get college collections
        app.get('/api/colleges', async(req,res) => {
            const result = await collegeCollections.find().toArray();
            res.send(result)
        })

        // ! --------------------- admission related api

         app.post('/api/admission',async(req,res) => {
             const data = req.body;
             const result = await admissionCollections.insertOne(data);
             res.send(result)
         })

        //  get api
        app.get('/api/admission', async(req,res) => {
            const result = await admissionCollections.find().toArray();
            res.send(result)
        })

        
        // ! --------------------- feedback related api

         app.post('/api/feedback',async(req,res) => {
             const data = req.body;
             const result = await feedbackCollections.insertOne(data);
             res.send(result)
         })

        //  get api
        app.get('/api/feedback', async(req,res) => {
            const result = await feedbackCollections.find().toArray();
            res.send(result)
        })




    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',async(req,res) => {
     res.send('prime-uni server is running')
})

app.listen(port,() => {
     console.log('prime-uni server is running on port',port);
     
})
