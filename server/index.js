const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '.env.local') });
const connectToMongo = require("./db");
connectToMongo()

const express = require('express');
var cors = require('cors');
const {Server} = require("socket.io")
const app = express();
const http = require("http");
const server = http.createServer(app);

app.use(cors())
const io = new Server(server,{
  cors:{
    origin:"http://localhost:5173",
    methods:["POST","GET","DELETE","PUT"],
    credentials:true
  }
})

io.on('connection',(socket)=>{
  console.log(`new user connected ${socket.id}`);
  socket.on('disconnect',()=>{
    console.log(`${socket.id} user disconnected`);
  })
})
app.set("socket", io);
app.use(express.json()); 
app.get('/', (req, res) => {
  res.send('Hello World!')

})
app.use("/auth",require("./routes/auth"));
app.use("/owner",require("./routes/owner"));
app.use("/status",require("./routes/book"));


server.listen(3000,()=>{
  console.log(`Server running on http://127.0.0.1:3000`);
})