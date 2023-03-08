const router = require("express").Router();

const Car = require("../model/Car");
const jwt = require('jsonwebtoken')

const bcrypt = require("bcrypt");
const { multerUploadS3 } = require("../utils/multer");

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const car = await Car.findById(id);
    res.status(200).json({ Car });
  } catch (e) {
    res.status(400).send(e.message);
  }
});



router.post("/pic", multerUploadS3.any(), async (req, res, next) => {
  const file = req.file
  console.log(file)
res.send("ok")
});

router.post("/", multerUploadS3.any(), (req, res) => {
 try{ const { make, model, year, price, description } = req.body;
  let pic = null;
  if (req.files > 0) {
    pic = req.files[0].location;
  }
  const newCar = new Car({
    make,
    model,
    year,
    price,
    description,
    pic,
  });

  newCar
    .save()
   
    res.status(201).json(newCar);
  } catch (e) {
    let msg;
    if (e.code == 9) {
 
    } else {
     console.log(res.body)

    }
    console.log(e);
    res.status(400).json(msg);
  
}});

router.post("/1", async (req, res) => {
  try {
    const {
      make,
      model,
      year,
      price,
      description,
      pic,

    } = req.body;
    //console.log(req.body);
    const car = await Car.create({
      make,
      model,
      year,
      price,
      description,
      pic,
    }
    
    
   
    );
 
    res.status(201).json(car);
  } catch (e) {
    let msg;
    if (e.code == 9) {
 
    } else {
     console.log(res.body)

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
    const result = await Car.findByIdAndUpdate(id, updates, { new: true });
    res.send(result);
  } catch (error) {
    console.log(error.message);
  }
});



 




module.exports = router;
