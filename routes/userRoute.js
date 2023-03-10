const router = require("express").Router();
const User = require("../model/User")
const Car = require("../model/Car");
const jwt = require('jsonwebtoken')

const bcrypt = require("bcrypt");

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    res.status(200).json({ user });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.get("/", function (req, res) {
  User.find({}, function (err, users) {
    res.json(users);
  });
});

router.post('/login', async(req, res) => {
  const {email, password} = req.body;
  try {
    const user = await User.findByCredentials(email, password);
    res.json(user)
  } catch (e) {
    res.status(400).send(e.message)
  }
})


router.post("/", async (req, res) => {
  try {
    const {
      email,
      password,
    
    } = req.body;
    //console.log(req.body);
    const user = await User.create({
      email,
      password,
    
    });

    res.status(200).json({ user });
  } catch (e) {
    let msg;
    if (e.code == 11000) {
      msg = "User already exists";
    } else {
      msg = e.message;
    }
    console.log(e);
    res.status(400).json(msg);
  }
});



//update bio
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;

    // https://stackoverflow.com/questions/30419575/mongoose-findbyidandupdate-not-returning-correct-model
    const result = await User.findByIdAndUpdate(id, updates, { new: true });
    res.send(result);
  } catch (error) {
    console.log(error.message);
  }
});



 




module.exports = router;
