const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')
const ObjectId=require('mongodb').ObjectId
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://database:JL73MV29zPlpyEwc@cluster0.ivq4v.mongodb.net/task?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });
const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())


app.get('/',(req, res) => {
    res.sendFile(__dirname + '/index.html')
})



client.connect(err => {
  const collection = client.db("task").collection("todos");
  app.post('/addTask',(req, res) => {
      collection.insertOne(req.body)
      .then(data =>{
          res.redirect('/')
      })
  })
  app.get('/tasks',(req, res) => {
      collection.find({})
      .toArray((err, result) =>{
          res.send(result)
      })
  })
  
  app.get('/update/:id',(req, res) => {
      const id=req.params.id
      collection.find({_id:ObjectId(id)})
      .toArray((err, result) =>{
          res.send(result[0])
      })
  })

  app.patch('/updateTask/:id',(req, res) => {
    const id=req.params.id
    collection.updateOne({ _id:ObjectId(id) },
        { $set: { time: req.body.time, marks: req.body.marks},
          $currentDate: { lastModified: true } })
  })
  app.delete('/taskDelete/:id',(req, res) => {
      const id=req.params.id
      collection.deleteOne({_id:ObjectId(id)})
      .then(result => res.send(result.deletedCount>0))

  })



});



app.listen(3000, ()=> console.log('port 3000 is running'))