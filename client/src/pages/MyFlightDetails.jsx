import Footer from "../components/Footer";
import Loading from "../components/Loading";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthContext from "../authContext";
import { useParams } from "react-router-dom";
import "../CSS/MyFlightDetails.css";
import "../CSS/Loading.css";
import Navbar from "../components/Navbar";
import Nav2 from "../components/Nav2";
import axios from 'axios';

function MyFlightDetails() {
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useContext(AuthContext);

  const [age, setAge] = useState(33);
  const [bookingDate, setBookingDate] = useState("");
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [flightId, setFlightId] = useState("");
    const [gender, setGender] = useState("");
    const [lastName, setLastName] = useState("");
    const [nationality, setNationality] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

  let { id } = useParams();
console.log("Id of booking===" , id)

  const fetchBookedFlightDetails = async () => {
    try {
        const response = await axios.get(
            `http://localhost:8000/api/bookedflight/${id}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Include token if required
                }
            }
        );
        console.log("Booked Flight Details:", response.data);
        setAge(response.data.bookedFlight.age);
        setBookingDate(response.data.bookedFlight.bookingDate)
        setEmail(response.data.bookedFlight.email)
        setFirstName(response.data.bookedFlight.firstName)
        setFlightId(response.data.bookedFlight.flightId)
        setGender(response.data.bookedFlight.gender)
        setLastName(response.data.bookedFlight.lastName)
        setNationality(response.data.bookedFlight.nationality)
        setPhoneNumber(response.data.bookedFlight.phoneNumber)
    } catch (error) {
        console.error("Error fetching booked flight details:", error);
        toast.error(error.message)
    }
};

  useEffect(() => {
    fetchBookedFlightDetails()
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  return (
    <div>
      <div className={isLoading ? "loading" : "loaded"}>
        <Loading isLoading={isLoading} />
        <div className="content_">
          <Navbar />
          <Nav2>Flight Details</Nav2>
          <div className="bg-slate-100 pt-4 pb-4">
            {!isAuthenticated ? (
              <div className="text-2xl text-center">
                Login First to visit Flights
              </div>
            ) : (
              <div className="flight-details-container">
                {/* Flight Details Section */}
                <div className="flight-booking-detail payment1">
                  <div className="flight-booking-title">
                    <div className="booking-title-text">
                      Your Flight Details
                    </div>
                  </div>
                  <div className="booking-detail-box payment-history">
                    <div className="detail-grid">
                      {/* First Column */}
                      <div className="detail-column">
                        <div className="detail-item">
                          <h5 className="detail-label">Flight ID</h5>
                          <h5 className="detail-value">{flightId}</h5>
                        </div>

                        <div className="detail-item">
                          <h5 className="detail-label">Passenger</h5>
                          <h5 className="detail-value">
                            {firstName} {lastName}
                          </h5>
                        </div>

                        <div className="detail-item">
                          <h5 className="detail-label">Gender</h5>
                          <h5 className="detail-value">{gender}</h5>
                        </div>

                        <div className="detail-item">
                          <h5 className="detail-label">Email</h5>
                          <h5 className="detail-value">{email}</h5>
                        </div>
                      </div>

                      {/* Second Column */}
                      <div className="detail-column">
                        <div className="detail-item">
                          <h6 className="detail-label">Nationality</h6>
                          <h5 className="detail-value">{nationality}</h5>
                        </div>

                        <div className="detail-item">
                          <h6 className="detail-label">Phone</h6>
                          <h5 className="detail-value">{phoneNumber}</h5>
                        </div>
                      </div>
                    </div>

                    <hr className="separator-line" />

                    <div className="pass-details">
                      <div className="pass-details-title">
                        Additional Details
                      </div>
                      <div className="detail-grid">
                        <div className="detail-column">
                          <div className="detail-item">
                            <h6 className="detail-label">Age</h6>
                            <h5 className="detail-value">{age}</h5>
                          </div>
                        </div>
                        <div className="detail-column">
                          <div className="detail-item">
                            <h6 className="detail-label">Postal Code</h6>
                            <h5 className="detail-value">
                              {"N/A"}
                            </h5>
                          </div>
                        </div>
                        <div className="detail-column">
                          <div className="detail-item">
                            <h6 className="detail-label">Passport No</h6>
                            <h5 className="detail-value">
                              { "N/A"}
                            </h5>
                          </div>
                        </div>
                      </div>
                    </div>

                    <hr className="separator-line" />

                    <div className="booking-flight-text">
                      <h6 className="detail-label">Booking Date</h6>
                      <h6 className="detail-value">
                        {new Date(bookingDate).toLocaleDateString()}
                      </h6>
                    </div>
                  </div>
                </div>

                {/* Summary Section */}
                <div className="payment1 summary-section" >
                  <div className="flight-booking-title">
                    <div className="booking-title-text">Summary</div>
                  </div>
                  <div className="payment-history" style={{ paddingLeft: "20px" }}>
                    <div className="detail-grid">
                      <div className="detail-column">
                        <div className="detail-item">
                          <h6 className="detail-label">Flight ID</h6>
                          <h5 className="detail-value">{flightId}</h5>
                        </div>

                        <div className="detail-item">
                          <h6 className="detail-label">Passenger</h6>
                          <h5 className="detail-value">
                            {firstName} {lastName}
                          </h5>
                        </div>
                      </div>

                      <div className="detail-column">
                        <div className="detail-item">
                          <h6 className="detail-label">Email</h6>
                          <h5 className="detail-value">{email}</h5>
                        </div>

                        <div className="detail-item">
                          <h6 className="detail-label">Phone</h6>
                          <h5 className="detail-value">{phoneNumber}</h5>
                        </div>
                      </div>
                    </div>

                    <div
                      className="booking-flight-text"
                      style={{ marginTop: "20px" }}
                    >
                      <h6 className="detail-label">Booking Status</h6>
                      <h6 className="detail-value" style={{ color: "#10B981" }}>
                        Confirmed
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default MyFlightDetails;
