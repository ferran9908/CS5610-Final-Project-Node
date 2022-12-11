import { Router } from "express";
import House from "../models/house.js";
import isLoggedIn from "../middlewares/isLoggedIn.js";


const router = Router();


router.post("/add-house", isLoggedIn, async (req, res) => {
  const { user } = req;
  if (user.role === "BUYER" || user.role === "ADMIN") {
    const house = House.create(req.body);
    return res.status(201).send(house);
  } else {
    return res
      .status(401)
      .send({ error: "This route is accessible only to the admin" });
  }
});

router.get("/get-house-details/:id", async (req, res) => {
  const houseId = req.params.id;
  const house = await House.findOne({ _id: houseId });
  return res.status(201).send(house);
});


//Delete House
router.delete("/:hid", isLoggedIn, async (req, res) => {
    const houseId = req.params.hid;
    const { user } = req

    // If user is Buyer / Admin
    if(user.role === "SELLER" || user.role === "ADMIN" ) {
    //Delete
        await House.deleteOne({_id: houseId});
        res.sendStatus(200);
    }
    else {
        return res.status(401).send({ error: "This route is accessible only to the Buyer / seller" })
    }

})


router.post("/get-houses", isLoggedIn, async (req, res) => {
  const houses = await House.find({ sellerEmailId: req.body.email });
  return res.send(houses);
});
export default router;

