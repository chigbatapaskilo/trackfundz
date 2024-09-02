// create a connection to the mongodb database
// require mongoose

const mongoose=require('mongoose');
// require dotenv which is the environment for hidding sensitive data
require('dotenv').config();
// require our database url
const url=process.env.DATABASE_URL
// connect the mongoose the database url
mongoose.connect(url)
// check for error using the asynchorous promise
.then(()=>{
    
    console.log('connection to database established.');
    
})
.catch((error)=>{
    console.log(`unable to connect to database becase ${error.message}`);
    
});