import { Router } from 'express'
import User from '../models/users.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import isLoggedIn from '../middlewares/isLoggedIn.js'

const router = Router()

const SECRET = "CS5610"

router.post("/signup", async (req, res) => {
    const { email, password, role, name } = req.body

    if (!email || !password || !role || !name) { return res.status(400).send({ message: "BAD_REQUEST" }) }

    const encryptedPassword = await bcrypt.hash(password, 3);

    // TODO: Should call User DAO to create user
    const user = await User.create({ email, password: encryptedPassword, name, role })

    return res.status(201).send(user)
})

router.post("/login", async (req, res) => {
    const { email, password } = req.body

    //TODO: UserDAO call to find user by email
    const user = await User.findOne({ email })

    if (user) {
        const isSame = await bcrypt.compare(password, user.password)
        if (isSame) {
            const token = jwt.sign({ email, role: user.role, name: user.name }, SECRET)
            return res.send({ jwt: token })
        }
        else {
            return res.status(400).send({ error: "Incorrect Password" })
        }
    }
    else {
        return res.status(400).send({ error: "User does not exist! Please sign up." })
    }
})

router.get("/get-all-users", isLoggedIn, async (req, res) => {
    const { user } = req
    if (user.role === "ADMIN") {
        const users = await User.find({})
        return res.send(users)
    }
    else {
        return res.status(401).send({ error: "This route is accessible only to the admin" })
    }
})

export default router