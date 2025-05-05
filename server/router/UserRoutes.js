// backend/routes/flights.js
const express = require('express');
const router = express.Router();
const { searchFlight, bookFlight, getBookedFlights, getUserDetails, updateUserDetails,alreadybooked, searchAllFlights, searchSingleFlight, getBookedFlightById, getAllBookedFlights, deleteBooking } = require('../controllers/appController');



/* GET Methods */
router.route('/getbookedflights').get(getBookedFlights);
router.route('/getallbookedflights').get(getAllBookedFlights);
router.route('/bookedflight/:id').get(getBookedFlightById   );
router.route('/getuserdetails').get(getUserDetails);
router.route('/getsingleflight').post(searchSingleFlight);

/* POST Methods */
router.route('/bookflight').post(bookFlight);
router.route('/canbook').post(alreadybooked);
router.route('/searchflight').post(searchFlight);
router.route('/searchAllFlights').post(searchAllFlights);

/* PUT Methods */
router.route('/updateuserdetails').put(updateUserDetails);

router.route('/delete-booking/:bookingId').delete(deleteBooking)


module.exports = router;
