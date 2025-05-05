const User = require('../model/User.model');
const Flight = require('../model/Flight.model');


async function getUserDetails(req, res) {
    const username = req.user.username;

    try {
        const user = await User.findOne({ username }).select('firstName lastName mobile address username email');
        if (!user) {
            return res.status(400).json({ message: "Not authorized" });
        }
        return res.status(200).json({ status: "ok", user });
        
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong." });
    }
}

async function updateUserDetails(req, res) {
    const username = req.user.username;
    const { firstName, lastName, address, mobile } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Not authorized" });
        }
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (mobile) user.mobile = mobile;
        if (address) user.address = address;

        await user.save();

        return res.status(201).json({ status: "ok", user, message: "User Details updated." });

    } catch (error) {
        return res.status(500).json({ message: "Something went wrong." });
    }
}

async function searchFlight(req, res) {
    const { to, from, date, category } = req.body;

    try {
        let searchCriteria = {};
        if (to) searchCriteria.to = to;
        if (from) searchCriteria.from = from;
        if (category) searchCriteria.category = category;
        if (date) searchCriteria.date = new Date(date);

        // Find flights matching the criteria
        const flights = await Flight.find(searchCriteria).select('flightNo totalPrice to from category date time totalSeats');

        if (flights.length === 0) {
            return res.status(404).json({ message: 'No flights found matching the criteria' });
        }

        
        res.status(200).json({
            message: 'Flights retrieved successfully',
            flights
        });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong." });
    }
}

async function searchAllFlights(req, res) {
    try {
        const flights = await Flight.find();

        if (flights.length === 0) {
            return res.status(404).json({ message: 'No flights found ' });
        }

        res.status(200).json({
            message: 'Flights retrieved successfully',
            flights
        });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong." });
    }
}

async function searchSingleFlight(req, res) {
    const { id } = req.body; // Assuming the flight ID is sent as a route parameter

    try {
        const flight = await Flight.findById(id); // Use Mongoose's findById method
        if (!flight) {
            return res.status(404).json({ message: "Flight not found" });
        }
        return res.status(200).json(flight); // Send the flight details as response
    } catch (error) {
        console.error("Error fetching flight:", error);
        return res.status(500).json({ message: "Internal server error", error });
    }
}

const getBookedFlightById = async (req, res) => {
    const { id } = req.params; 

    if (!id) {
        return res.status(400).json({ message: "Flight booking ID is required" });
    }

    try {
        // Query to find the user and return only the matched object in the flights array
        const user = await User.findOne(
            { "flights._id": id }, // Filter condition
            { "flights.$": 1 } // Projection to include only the matched flight
        );

        if (!user || !user.flights.length) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // Extract the matched flight
        const bookedFlight = user.flights[0];
        return res.status(200).json({ bookedFlight });
    } catch (error) {
        console.error("Error fetching booked flight:", error);
        return res.status(500).json({ message: "An error occurred while fetching the booking.", error });
    }
};


const bookFlight = async (req, res) => {
    const { flightNo, username, passengers } = req.body; // Ensure passengers is passed from the frontend
    console.log(req.body);

    try {
        if (!username || !flightNo || !passengers || passengers.length === 0) {
            return res.status(400).json({ message: "Incomplete booking details" });
        }

        // Find the flight by flight number
        const flight = await Flight.findOne({ flightNo });
        if (!flight) {
            return res.status(400).json({ message: `No flight exists with number - ${flightNo}` });
        }

        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the user has already booked the same flight
        const alreadyBooked = user.flights.some(
            (booking) => booking.flightId.toString() === flight._id.toString()
        );
        if (alreadyBooked) {
            return res.status(400).json({ message: 'You have already booked this flight' });
        }

        // Ensure enough seats are available
        if (flight.totalSeats < passengers.length) {
            return res.status(400).json({ message: 'Not enough seats available for booking' });
        }

        // Add each passenger to user's bookedFlights array
        passengers.forEach((passenger) => {
            user.flights.push({
                flightId: flight._id,
                firstName: passenger.firstName,
                lastName: passenger.lastName,
                gender: passenger.gender,
                email: passenger.email,
                nationality: passenger.nationality,
                phoneNumber: passenger.phoneNumber,
                age: passenger.age,
                postalCode: passenger.postalCode,
                passportNo: passenger.passportNo,
            });
        });

        // Save the user and update the flight
        await user.save();

        flight.totalSeats -= passengers.length;
        await flight.save();

        return res.status(200).json({ message: 'Booking successful', bookedPassengers: passengers });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Please try again later.", error });
    }
};


const alreadybooked = async (req, res) => {
    const username = req.user.username;
    const { flightNo } = req.body;
    try {
        if (username) {
            const flight = await Flight.findOne({ flightNo });
            if (flight) {
                const user = await User.findOne({ username });

                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }

                if (user.flights.includes(flight._id)) {
                    return res.status(200).json({ canbook: false, message: 'You have already booked this flight' });
                }
                return res.status(200).json({ canbook: true });
            } else {
                return res.status(400).send({ message: `No flight exist with no - ${flightNo}` });
            }
        } else {
            return res.status(400).send({ message: "Not Authorized!" });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Please try again later.", error });
    }
}

const getBookedFlights = async (req, res) => {
    const username = req.user.username;
    // console.log(username);

    try {
        // Find the user and populate the flights array
        const user = await User.findOne({ username }).populate('flights');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: 'Flights retrieved successfully',
            flights: user.flights
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

const getAllBookedFlights = async (req, res) => {
    try {
        // Retrieve all users and extract their flights
        const users = await User.find({}).populate('flights');

        // Extract all flights from all users
        const allBookedFlights = users.reduce((acc, user) => {
            return acc.concat(user.flights);
        }, []);

        res.status(200).json({
            message: 'All booked flights retrieved successfully',
            flights: allBookedFlights,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


const deleteBooking = async (req, res) => {
    const { userId } = req.body; // User ID from the request body
    const { bookingId } = req.params; // Booking ID from the request parameters
    try {

        if (!userId || !bookingId) {
            return res.status(400).json({ message: "Incomplete request. User ID and Booking ID are required." });
        }

        // Find the user by user ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find the booking to be deleted
        const bookingIndex = user.flights.findIndex(
            (booking) => booking._id.toString() === bookingId
        );

        if (bookingIndex === -1) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // Extract flightId before removing the booking
        const { flightId } = user.flights[bookingIndex];

        // Remove the booking from the user's flights array
        user.flights.splice(bookingIndex, 1);
        await user.save();

        // Find the flight by flightId and increment the seat count
        const flight = await Flight.findById(flightId);
        if (flight) {
            flight.totalSeats += 1; // Increment the seat count
            await flight.save();
        }

        return res.status(200).json({
            message: "Booking deleted successfully and seat count updated",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error. Please try again later.",
            error,
        });
    }
};



module.exports = {
    bookFlight,
    getBookedFlights,
    getUserDetails,
    updateUserDetails,
    searchFlight,
    searchAllFlights,
    alreadybooked, 
    searchSingleFlight,
    getBookedFlightById,
    getAllBookedFlights,
    deleteBooking
};
