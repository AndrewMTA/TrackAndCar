require("dotenv").config();
const path = require('path')
const express = require('express');
const app = express();
const User = require('./model/User');
const cors = require('cors');
const jwt = require('jsonwebtoken')
const mongoose = require("mongoose");
const carRoutes = require('./routes/carRoute')
const userRoutes = require('./routes/userRoute')



app.use(express.urlencoded({ extended: true, limit: '120MB' }));
app.use(express.json({ limit: '120MB' }));
app.use(cors());


app.use('/cars', carRoutes)
app.use('/user', userRoutes)


app.get('reset-password', (req, res, next) => {
   
})
app.post ('reset-password', (req, res, next) => {
   
})
  
  const server = require('http').createServer(app);


mongoose.set('strictQuery', false);

const MONGODB = process.env.MONGODB;
mongoose.connect(MONGODB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to DB");
}).catch(err => {
  console.log(err.message)
});







// socket connection





  app.delete('/logout', async (req, res) => {
    try {
      const { _id } = req.body;
      const user = await User.findById(_id);

      await user.save();
      res.status(200).send();
    } catch (e) {
      console.log(e);
      res.status(400).send()
    }
  })



const PORT = process.env.PORT || 3000;

server.listen(PORT, function () {
  console.log(`Express server listening on port ${PORT}`);
})




if (process.env.NODE_ENV == "production") {
  app.use(express.static(path.join(__dirname, "/client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}
