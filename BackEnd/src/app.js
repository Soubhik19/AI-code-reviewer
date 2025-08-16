const express = require('express');
const aiRoutes = require('./routes/ai.routes');
const cors = require('cors');
const dotenv = require('dotenv');


const app = express();
app.use(cors({
  origin:process.env.FRONT,  // only allow this frontend
  methods: ["GET", "POST"],         // allowed methods
  allowedHeaders: ["Content-Type"], // allowed headers
}));


app.get('/',(req,res)=>{
    res.send('Hello World!');})
app.use(express.json());
app.use('/ai', aiRoutes);
module.exports = app;
