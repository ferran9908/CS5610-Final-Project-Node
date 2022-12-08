import { Router } from 'express'
import Message from "../models/message.js";
import isLoggedIn from '../middlewares/isLoggedIn.js'


const router = Router()

router.post("/send-message", isLoggedIn,async (req, res) => {
    const {user} = req

    if (user.role === "BUYER") {
        const newMessage = req.body
        let currentdate = new Date();
        newMessage.createdDate = currentdate.toLocaleString();
        Message.create(newMessage)
        return res.status(201).send(newMessage)
    }
    else {
        return res.status(401).send({ error: "This route is accessible only to the buyer" })
    }
})


//Get message by Seller
router.get("/get-messages-seller/:sid", isLoggedIn, async (req, res) => {
    const sId = req.params.sid;
    const messages = await Message.find({sellerId: sId})
    return res.send(messages)
})

//Get messages by User/Buyer
router.get("/get-messages-buyer/:uid", isLoggedIn, async (req, res) => {
    const uId = req.params.uid;
    const messages = await Message.find({userId: uId})
    return res.send(messages)
})


router.delete("/:mid", isLoggedIn, async (req, res) => {
    const messageId = req.params.mid;
    const { user } = req

    // If user is Seller
    if(user.role == "SELLER") {
        //Delete
        await message.deleteOne({_id: messageId});
        res.sendStatus(200);
     }
    else {
        return res.status(401).send({ error: "This route is accessible only to the Buyer / seller" })
    }

})

export default router