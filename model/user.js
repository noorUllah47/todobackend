const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let userSchema = new Schema({
    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
    email: {
        type: String,
        unique:true
    },
    password: {
        type: String
    },
    token:{
        type:String
    }
  
});
module.exports = mongoose.model('user', userSchema);