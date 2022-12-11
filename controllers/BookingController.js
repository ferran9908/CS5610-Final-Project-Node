import { Router } from 'express'

//import isLoggedIn from '../middlewares/isLoggedIn.js'
import bookings from "../models/booking.js";
import isLoggedIn from "../middlewares/isLoggedIn.js";


const router = Router()

//Create Booking
router.post("/book-tour",  async (req, res) => {


    const newBooking = req.body
    let currentdate = new Date();
    newBooking.createdDate = currentdate.toLocaleString();
    bookings.create(newBooking);
    return res.send(newBooking)

})

//Delete Booking
router.delete("/:bid",isLoggedIn, async (req, res) => {
    const bookingId = req.params.bid;
    const { user } = req

    //Find the booking
    //let thisBooking = await bookings.find(tour => tour._id == bookingId);

    // If user is Buyer / Seller of that Booking
    //if(user._id == thisBooking.sellerId || user._id == thisBooking.buyerId) {
        //Delete

    await bookings.deleteOne({_id: bookingId});
    res.sendStatus(200);
    // }
    // else {
    //     return res.status(401).send({ error: "This route is accessible only to the Buyer / seller" })
    // }

})

//Find all bookings
router.get("/find-all",async (req, res)=>  {
    const allBookings = await bookings.find({})
    res.send(allBookings)
})

//Find all bookings - Buyer
router.get("/find-all-buyer/:bid", async (req, res)=>  {
    const buyerId = req.params.bid;
    const allBookings = await bookings.find({buyerID: buyerId})
    res.send(allBookings)
})

//Find all bookings - Seller
router.get("/find-all-seller/:sid",async (req, res)=>  {
    const sellerId = req.params.sid;
    const allBookings = await bookings.find({sellerID: sellerId})
    res.send(allBookings)
})

//Buyer approves a Booking
router.put("/:bid",async (req, res)=>  {
    const bookingId = req.params.bid;

    await bookings.updateOne({_id: bookingId}, {isAccepted: true})

    const allBookings = await bookings.find({})
    res.send(allBookings)

})

export default router

