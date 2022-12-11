import { Router } from 'express'

//import isLoggedIn from '../middlewares/isLoggedIn.js'
import bookings from "../models/booking.js";
import isLoggedIn from "../middlewares/isLoggedIn.js";
import Booking from '../models/booking.js';
import User from '../models/users.js';


const router = Router()

router.post("/book", isLoggedIn, async (req, res) => {
    const { user } = req

    if (user.role === "BUYER") {
        const newBooking = req.body
        const booking = await Booking.create(newBooking)
        const { _id: id } = booking
        // const userData = await User.findOne({ email: newMessage.sellerEmailId })
        console.log({ s: newBooking.sellerEmailId, b: newBooking.buyerEmailId })
        const sellerData = await User.findOne({ email: newBooking.sellerEmailId })
        const buyerData = await User.findOne({ email: newBooking.buyerEmailId })


        if (!sellerData.bookings) {
            sellerData.bookings = [{ booking: id }]
        } else {
            sellerData.bookings.push({ booking: id })
        }
        await sellerData.save()

        if (!buyerData.bookings) {
            buyerData.bookings = [{ booking: id }]
        } else {
            buyerData.bookings.push({ booking: id })
        }
        await buyerData.save()

        return res.status(201).send({ booking, buyerData, sellerData })
    }
    else {
        return res.status(401).send({ error: "This route is accessible only to the buyer" })
    }
})


//Create Booking
router.post("/book-tour", async (req, res) => {
    const newBooking = req.body
    let currentdate = new Date();
    newBooking.createdDate = currentdate.toLocaleString();
    bookings.create(newBooking);
    return res.send(newBooking)
})

//Delete Booking

router.delete("/:bid", isLoggedIn, async (req, res) => {

    const bookingId = req.params.bid;
    const { user } = req

    //Find the booking
    let thisBooking = await bookings.find({ _id: bookingId });

    // If user is Buyer / Seller of that Booking
    if (user._id === thisBooking.sellerId || user._id === thisBooking.buyerId) {
        //Delete
        await bookings.deleteOne({ _id: bookingId });
        res.sendStatus(200);
    }
    else {
        return res.status(401).send({ error: "This route is accessible only to the Buyer / seller" })
    }

})

//Find all bookings
router.get("/find-all", isLoggedIn, async (req, res) => {
    const allBookings = await bookings.find({})
    res.send(allBookings)
})

//Find all bookings - Buyer

router.get("/find-all-buyer/:bid", isLoggedIn, async (req, res) => {

    const buyerId = req.params.bid;
    const allBookings = await bookings.find({ buyerID: buyerId })
    res.send(allBookings)
})

//Find all bookings - Seller
router.get("/find-all-seller/:sid", isLoggedIn, async (req, res) => {
    const sellerId = req.params.sid;
    const allBookings = await bookings.find({ sellerID: sellerId })
    res.send(allBookings)
})

//Seller approves a Booking
router.put("/:bid", isLoggedIn, async (req, res) => {
    const { user } = req
    const bookingId = req.params.bid;

    // If user is Seller of that Booking
    if (user.role === "SELLER") {
        await bookings.updateOne({ _id: bookingId }, { isAccepted: true })
        const allBookings = await bookings.find({})
        res.send(allBookings)
    }
    else {
        return res.status(401).send({ error: "This route is accessible only to the seller" })
    }

})

export default router

