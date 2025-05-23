import '../CSS/FlightCard.css';
import React, { useState, useContext } from 'react';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';
import AuthContext from '../authContext';
import Loading from '../components/Loading';
import Navbar from '../components/Navbar';
import BookingDetails from '../components/BookingDetails';
import Nav2 from '../components/Nav2';
import Footer from '../components/Footer';
import '../CSS/BookFlight.css';

function BookFlight({ bookFlightData }) {
    const [isLoading, setIsLoading] = useState(true);
    setTimeout(() => {
        setIsLoading(false);
    }, 1500);
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();
    const { flightNo, totalPrice } = bookFlightData;

    const [passengers, setPassengers] = useState([{
        gender: '',
        firstName: '',
        lastName: '',
        email: '',
        nationality: '',
        phoneNumber: '',
        age: '',
        postalCode: '',
        passportNo: ''
    }]);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    const addPassenger = () => {
        if (passengers.length < 6) {
            setPassengers([...passengers, {
                gender: '',
                firstName: '',
                lastName: '',
                email: '',
                nationality: '',
                phoneNumber: '',
                age: '',
                postalCode: '',
                passportNo: ''
            }]);
        } else {
            toast.error("Maximum 6 passengers allowed");
        }
    };

    const handleChange = (index, event) => {
        const { name, value } = event.target;
        const newPassengers = passengers.map((passenger, i) => (
            i === index ? { ...passenger, [name]: value } : passenger
        ));
        setPassengers(newPassengers);
    };

    const deletePassenger = (index) => {
        const newPassengers = passengers.filter((_, i) => i !== index);
        setPassengers(newPassengers);
    };

    const checkoutData = () => {
        if (!isAuthenticated) {
            toast.error("Login first to book flight");
            navigate('/login');
            return;
        }

        const discount = Math.floor(Math.random() * (12 - 5 + 1)) + 5; // Generate a random discount between 5% and 12%
        navigate('/checkout', {
            state: { 
                price: totalPrice,
                discount: discount,
                passengers: passengers, // Pass passenger data to the checkout page
                flightNo: flightNo
            }
        });
    };

    return (
        <div className={isLoading ? 'loading' : 'loaded'}>
            <Loading isLoading={isLoading} />
            <div className="content_">
                <Navbar />
                <Nav2>Flight Booking</Nav2>
                <div className="all-booking-info bg-slate-100">
                    <div className="airline-details">
                        <BookingDetails flightData={bookFlightData} />
                    </div>
                    <div className="booking-details">
                        <div className="passengers-info">
                            <div className='enter-detail'>ENTER YOUR DETAILS</div>
                            <form>
                                {passengers.map((passenger, index) => (
                                    <div key={index} className="passenger-details">
                                        <div className='first-line'>
                                            <div>
                                                <select
                                                    name="gender"
                                                    value={passenger.gender}
                                                    onChange={(e) => handleChange(index, e)}
                                                    required
                                                >
                                                    <option value=""> Gender</option>
                                                    <option value="male">Male</option>
                                                    <option value="female">Female</option>
                                                    <option value="other">Other</option>
                                                </select>
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    placeholder="First Name"
                                                    value={passenger.firstName}
                                                    onChange={(e) => handleChange(index, e)}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    placeholder="Last Name"
                                                    value={passenger.lastName}
                                                    onChange={(e) => handleChange(index, e)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className='second-line'>
                                            <div>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    placeholder="Email"
                                                    value={passenger.email}
                                                    onChange={(e) => handleChange(index, e)}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    name="nationality"
                                                    placeholder="Nationality"
                                                    value={passenger.nationality}
                                                    onChange={(e) => handleChange(index, e)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className='third-line'>
                                            <div>
                                                <input
                                                    type="tel"
                                                    name="phoneNumber"
                                                    placeholder="Phone Number"
                                                    value={passenger.phoneNumber}
                                                    onChange={(e) => handleChange(index, e)}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="number"
                                                    name="age"
                                                    placeholder="Age"
                                                    value={passenger.age}
                                                    min="0"
                                                    max="150"
                                                    onChange={(e) => handleChange(index, e)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className='delete-btn1'>
                                            {passengers.length > 1 && (
                                                <button className='text-sky-600'
                                                    type="button" onClick={() => deletePassenger(index)}>Delete Passenger</button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <div className='add-btn'>
                                    {passengers.length < 6 && (
                                        <button className='text-sky-600' type="button" onClick={addPassenger}>Add Passenger</button>
                                    )}
                                </div>
                                <div className='back-book-btns'>
                                    <button className="inline text-white rounded text-xl mt-6 font-bold p-2 sm:w-[8rem] transition duration-500 ease-in-out bg-blue-600 hover:bg-slate-300 hover:text-black transform hover:-translate-y-1 hover:scale-110 ..." type="button" onClick={() => navigate(-1)}>Back</button>
                                    <button className="inline text-white rounded text-xl mt-6 font-bold p-2 sm:w-[8rem] transition duration-500 ease-in-out bg-blue-600 hover:bg-slate-300 hover:text-black transform hover:-translate-y-1 hover:scale-110 ..." type="button" onClick={checkoutData}>Next</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
}

export default BookFlight;
