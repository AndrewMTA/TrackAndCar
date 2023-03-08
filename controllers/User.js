const router = require("express").Router();
const multer = require("multer");
const User = require("../model/User");
const Campaign = require("../model/Campaign");
const { multerUploadS3 } = require("../utils/multer");
const Application = require("../model/Applications");
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

router.post("/", async (req, res) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      userRole,
      lookingcrowdfund,
      companyName,
      goalAmount,
      pitchDeckURL,
      picture,
    } = req.body;
    //console.log(req.body);
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      userRole,
      lookingcrowdfund,
      companyName,
      goalAmount,
      pitchDeckURL,
      picture,
    });

  sendToken(user, 201, res )
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

const {
  forgotPassword,
  resetPassword,
  sendVerification,
  accountActivation,
} = require("../model/auth")


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

 router.route("/forgotpassword").post(forgotPassword);

 router.route("/account-activation").post(accountActivation);
 


 router.route("/sendVerification").post(sendVerification);


 router.route("/passwordreset/:resetToken").put(resetPassword);

 


router.put("/invest/:id", async (req, res) => {
  try {
    const { id, investamount } = req.body;
    const user = await User.findById(id);
    user.investamount = investamount;

    const result = await User.findByIdAndUpdate(id, user, { new: true });
    res.send(result);
  } catch (error) {
    console.log(error.message);
  }
});

JWT_SECRET = "124543"
const user = User

const secret = JWT_SECRET + user.password
const payload = {
  email: user.email,
  id: user.id
}
const token = jwt.sign(payload, secret, {expiresIn: '15m'})

  

router.get("/temporary/:id/:token",  (req, res, next) => {
const {id, token} = req.params;
res.send(req.params );

if (id !== user.id) { 
  res.send('Invalid I.D...')
}
}) ;


// login user

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);
    user.status = "online";
    await user.save();
   sendToken(user, 200, res);
  } catch (e) {
    res.status(400).json(e.message);
  }
});

//update picture
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
router.post("/:id", upload.single("file"), async (req, res, next) => {
  try {
    const id = req.params.id;
    const base64 = req.file.buffer.toString("base64");
    const updates = { picture: `data:${req.file.mimetype};base64,${base64}` };
    // console.log(updates);

    // https://stackoverflow.com/questions/30419575/mongoose-findbyidandupdate-not-returning-correct-model
    const result = await User.findByIdAndUpdate(id, updates, { new: true });
    res.send(result);
  } catch (error) {
    console.log("error in post update picture");
    console.log(error.message);
  }
});

router.post("/campaign/add", multerUploadS3.any(), async (req, res, next) => {
  try {
    if (req.files) {
      req.body.video = req.files[0].location;
      req.body.pic = req.files[1].location;
    }
    let data = req.body;
    data = { ...data, investorRewards: JSON.parse(data?.investorRewards) };
    const result = await Campaign.create(data);
    res.send(result);
  } catch (error) {
    console.log("error while adding campaign");
    console.log(error.message);
  }
});

router.patch("/campaign/:id", multerUploadS3.any(), async (req, res, next) => {
  try {
    if (req.files?.length > 0) {
      console.log("req.files", req.files);
      if (!req.body.video) {
        req.body.pic = req.files[0].location;
      } else if (!req.body.pic) {
        req.body.video = req.files[0].location;
      } else {
        req.body.video = req.files[0].location;
        req.body.pic = req.files[1].location;
      }
    }
    let data = req.body;
    data = { ...data, investorRewards: JSON.parse(data?.investorRewards) };
    const result = await Campaign.findByIdAndUpdate(req.params.id, data);
    res.send(result);
  } catch (error) {
    console.log("error while updaing campaign");
    console.log(error.message);
  }
});

router.get("/getCampaign/:id", async (req, res, next) => {
  try {
    const result = await Campaign.findOne({ user: req.params.id });
    res.send(result);
  } catch (error) {
    console.log("error while getting campaign");
    console.log(error.message);
  }
});

router.patch(
  "/updatedProfile/:id",
  multerUploadS3.any(),
  async (req, res, next) => {
    console.log("req.params.id", req.params.id);
    try {
      if (req.files?.length > 0) {
        req.body.picture = req.files[0].location;
      }
      let data = req.body;
      const result = await User.findByIdAndUpdate(req.params.id, data);
      res.send(result);
    } catch (error) {
      console.log("error while updaing user");
      console.log(error.message);
    }
  }
);

router.get("/:id/verify/:token/", async (req, res) => {
	try {
		const user = await User.findOne({ _id: req.params.id });
		if (!user) return res.status(400).send({ message: "Invalid link" });

		const token = await Token.findOne({
			userId: user._id,
			token: req.params.token,
		});
		if (!token) return res.status(400).send({ message: "Invalid link" });

		await User.updateOne({ _id: user._id, verified: true });


		res.status(200).send({ message: "Email verified successfully" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});
module.exports = router;
