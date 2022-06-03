const express = require('express');
const app = express();
const bcrypt=require("bcryptjs")
const jwt = require("jsonwebtoken");
const bodyParser= require("body-parser")
// const cors = require('cors');
const mongoose = require('mongoose');
let Todo = require('./model/todo.model');
const User = require("./model/user");

const PORT = 4000;
// app.use(cors());
app.use(bodyParser.json());
mongoose.connect('mongodb://127.0.0.1:27017/todos', { useNewUrlParser: true });
const connection = mongoose.connection;
connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})
// Port
app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
}); 

const todoRoutes = express.Router();

// get todo
app.use('/todos', todoRoutes);
todoRoutes.route('/').get(function(req, res) {
    Todo.find(function(err, todos) {
        if (err) {
            console.log(err);
        } else {
            res.json(todos)
        }
    });
});
// add Todo
todoRoutes.route('/add').post(function(req, res) {
    let todo = new Todo(req.body);
    todo.save()
        .then(todo => {
            res.status(200).json({'todo': 'todo added successfully'});
        })
        .catch(err => {
            res.status(400).send('adding new todo failed');
        });
});


// Update data
todoRoutes.route('/update/:id').post(function(req, res) {
    Todo.findById(req.params.id, function(err, todo) {
        if (!todo)
            res.status(404).send("data is not found");
        else
            todo.todo_description = req.body.todo_description;
            todo.todo_responsible = req.body.todo_responsible;
            todo.todo_priority = req.body.todo_priority;
            todo.todo_completed = req.body.todo_completed;
            todo.save().then(todo => {
                res.json('Todo updated!');
            })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
});
todoRoutes.route('/get/:id').get(function(req,res){
    Todo.findById(req.params.id,function(err,todo){
        if(!todo){
            res.status(404).send("data not found");
        }
        else{
            res.json(todo)
        }
    })
})
app.post("/signin",async(req,res) =>{
    console.log("=========>user",req.body)
    try{
const {first_name,last_name,email,password}=req.body;
if(!(first_name&&last_name&&password&&email)){
    res.status(400).send("all input is required")
}
const oldUser = await User.findOne({ email });
if (oldUser) {
    return res.status(409).send("User Already Exist. Please Login");
  }
  encryptedPassword =await bcrypt.hash(password,10)
  
  const user =await User.create({

      first_name,
      last_name,
      password:encryptedPassword,
      
      email:email.toLowerCase()
  })
  const token = jwt.sign(
    { user_id: user._id, email },
    process.env.TOKEN_KEY,
    {
      expiresIn: "2h",
    }
  );
  // save user token
  user.token = token;

  // return new user
  res.status(201).json(user);
} catch (err) {
    console.log(err);
  }
})
app.post("/signup",(req,res)=>{

})

app.get('/getuser',function(req,res){
    Todo.findById(req.params.id,function(err,User){
        if(!User){
            res.status(404).send("data not found");
        }
        else{
            res.json(User)
        }
    })
})