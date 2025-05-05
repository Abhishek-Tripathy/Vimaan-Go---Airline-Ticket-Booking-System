const mongoose = require('mongoose');
const validator = require('validator');

const BookedFlightSchema = new mongoose.Schema({
    flightId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Flight", 
        required: true 
    },
    gender: { type: String },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    nationality: { type: String },
    phoneNumber: { type: String },
    age: { type: Number },
    postalCode: { type: String },
    passportNo: { type: String },
    bookingDate: { type: Date, default: Date.now }, // Date of booking
});

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide unique username"],
        unique: [true, "Username Already Exists"]
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
        validate: [validator.isEmail, 'Invalid email'],
    },
    firstName: { type: String },
    lastName: { type: String },
    mobile: { type: Number },
    address: { type: String },
    profile: { type: String },
    flights: [BookedFlightSchema], // Array of objects for booking details
});

module.exports = mongoose.model.Users || mongoose.model('User', UserSchema);
