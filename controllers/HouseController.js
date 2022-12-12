import { Router } from "express";
import House from "../models/house.js";
import isLoggedIn from "../middlewares/isLoggedIn.js";
import User from "../models/users.js";


const router = Router();

router.post("/add-fav-house/:hid", isLoggedIn, async (req, res) => {
  const userId = req.user.id
  const houseId = req.params.hid
  const user = await User.findOne({ _id: userId })

  if (user) {
    user.favHouses.push({
      house: houseId
    })
    await user.save()
  }

  return res.status(200).send(user)
})

router.put("/remove-fav-house/:hid", isLoggedIn, async (req, res) => {
  const userId = req.user.id
  const houseId = req.params.hid
  const user = await User.findOne({ _id: userId })

  if (user) {
    let requiredIdx = -1
    for (let i = 0; i < user.favHouses.length; i++) {
      if (user.favHouses[i].house == houseId) {
        requiredIdx = i
        break
      }
    }
    if (requiredIdx !== -1) {
      user.favHouses.splice(requiredIdx, 1)
      await user.save()
    }
  }

  return res.status(200).send(user)
})

router.put("/edit-house/:hid", isLoggedIn, async (req, res) => {
  const { user } = req
  const houseId = req.params.hid;

  // If user is Seller of that House
  if (user.role === "SELLER") {
    await House.updateOne({ _id: houseId }, req.body)
    res.send()
  }
  else {
    return res.status(401).send({ error: "This route is accessible only to the seller" })
  }
})

router.post("/add-house", isLoggedIn, async (req, res) => {
  const { user } = req;
  if (user.role === "SELLER") {
    const house = House.create(req.body);
    return res.status(201).send(house);
  } else {
    return res
      .status(401)
      .send({ error: "This route is accessible only to the seller" });
  }
});

router.get("/get-house-details/:id", async (req, res) => {
  const houseId = req.params.id;
  const house = await House.findOne({ _id: houseId }).populate("images.image");
  return res.status(201).send(house);
});


//Delete House
router.delete("/:hid", isLoggedIn, async (req, res) => {
  const houseId = req.params.hid;
  const { user } = req

  // If user is Buyer / Admin
  if (user.role === "SELLER" || user.role === "ADMIN") {
    //Delete
    await House.deleteOne({ _id: houseId });
    res.sendStatus(200);
  }
  else {
    return res.status(401).send({ error: "This route is accessible only to the Buyer / seller" })
  }

})

router.get("/get-houses", async (req, res) => {
  const houses = await House.find().populate('images.image')
  return res.send(houses)
})


router.post("/get-houses", isLoggedIn, async (req, res) => {
  const houses = await House.find({ sellerEmailId: req.body.email });
  return res.send(houses);
});

router.get("/get-house-by-zipcode", async (req, res) => {
  const zip = req.query
  const houses = await House.find({ zipcode: zip })
  return res.send(houses)
})
export default router;

