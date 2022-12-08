import { Router } from 'express'
import House from '../models/house.js'
import isLoggedIn from '../middlewares/isLoggedIn.js'

const router = Router()

router.post("/add-house", isLoggedIn, async (req, res) => {
    const {user} = req
    if (user.role === "BUYER" || user.role === "ADMIN") {
        const house = House.create(req.body)
        return res.status(201).send(house)
    }
    else {
        return res.status(401).send({ error: "This route is accessible only to the admin" })
    }
})

router.get("/get-house-details/:id", async (req, res) => {
    const houseId = req.params.id
    const house = await House.findOne({_id : houseId})
    return res.status(201).send(house)
})

router.get("/get-houses", async (req, res) => {
    const houses = await House.find({})
    return res.send(houses)
})
export default router
