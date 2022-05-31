const express = require('express');
const bodyParser= require("body-parser")
const app=express();
const { MongoClient } = require('mongodb');
app.listen(8000,function(){
    console.log("app is listining on 8000")
})
const connectionString = "mongodb+srv://noor:noor%40123456@cluster0.pcmsa.mongodb.net/?retryWrites=true&w=majority";
MongoClient.connect(connectionString, (err, client) => {
    if (err) return console.error("error",err)
    console.log('Connected to Database')
  })
app.use(bodyParser.urlencoded({extended:true}))

app.post('/quotes', (req, res) => {
    quotesCollection.insertOne(req.body)
      .then(result => {
        console.log(result)
      })
      .catch(error => console.error(error))
  })