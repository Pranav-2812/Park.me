const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '.env.local') });
const connectToMongo = require("./db");
connectToMongo()
const express = require('express');
var cors = require('cors')
const app = express();
const port = 3000;
app.use(cors({
  origin:["http://localhost:5173"],
  methods:["POST","GET","DELETE","PUT"],
  credentials:true
}))
app.use(express.json()); //so that we can use json in express
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.use("/auth",require("./routes/auth"));
app.use("/owner",require("./routes/owner"));
app.use("/status",require("./routes/book"));
app.listen(port,()=>{
    console.log(`Server is running at http://127.0.0.1:${port}`);
  })