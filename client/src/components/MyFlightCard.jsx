import "../CSS/BookingDetails.css";
import React, { useEffect, useState } from "react";
import route_plan from "../images/route-plan.png";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

function MyFlightCard({ flightData, bookingId }) {
  console.log(flightData);

  const [flightNo, setFlightNo] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const backendUrl = "http://localhost:8000";
  const navigate = useNavigate();
  // const { flightNo, from, to, category, date, departureTime, duration, arrivalTime, price, aircraft, airline, stops } = flightData;

  async function fetch_data() {
    try {
      const response = await fetch(`${backendUrl}/api/getsingleflight`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ id: flightData }), // Send id in the body
      });

      const data = await response.json();
      console.log("My single flight data ===", data);

      if (response.ok) {
        setFlightNo(data.flightNo);
        setDepartureTime(data.departureTime);
        setFrom(data.from);
        setArrivalTime(data.arrivalTime);
        setTo(data.to);
        setDate(data.date);
      } else {
        toast.error(data.message || "Failed to fetch flight data.");
      }
    } catch (error) {
      toast.error("Network error, please try again later");
      console.error(error);
    }
  }

  const handleDelete = async () => {
    try {
        const token = localStorage.getItem("token"); // Retrieve the token from localStorage
        const userId = localStorage.getItem("userId"); // Assuming userId is also stored in localStorage

        if (!userId || !token) {
            throw new Error("User is not authenticated. Please log in.");
        }

        // Call the delete booking API
        const response = await axios.delete(`${backendUrl}/api/delete-booking/${bookingId}`, {
            headers: {
                Authorization: `Bearer ${token}`, // Add Authorization header
            },
            data: { userId }, // Send userId in the request body
        });
        
        if (response.status === 200) {
            alert("Booking deleted successfully");
            window.location.reload(); // Reload the entire page
        }
    } catch (error) {
        toast.error("Can not delete at the moment");
        console.error("Delete handler error ==> " ,error);
    }
  }

  useEffect(() => {
    fetch_data();
  }, []);

  return (
    <div className="flight-booking-detail">
      <div className="flight-booking-title flex justify-between">
        <div className="booking-title-text">{flightNo}</div>
        <div>
          <button
            className="text-xl mr-6 underline text-sky-600"
            onClick={() => {
              navigate(`/my_flights/${bookingId}`);
            }}
          >
            All Details
          </button>
          <button
            className="text-xl text-red-600 delete-button"
            onClick={() => {
              handleDelete();
            }}
          >
            Delete
          </button>
        </div>
      </div>
      <div className="booking-detail-box">
        <div className="booking-flight-detail">
          <div className="booking-flight-departure">
            <h5 className="booking-departure-time">{departureTime}</h5>
            <h5 className="booking-departure-location">{from}</h5>
          </div>
          <div className="booking-flight-route">
            <span className="route-text">From</span>
            <div className="route-info">
              <h5 className="route-duration">0h 50m</h5>
              <img
                src={route_plan}
                alt="Route Plan"
                className="route-plan-img"
              />
              <h6 className="route-stops">1 Stop</h6>
            </div>
            <span className="route-text">To</span>
          </div>
          <div className="booking-flight-departure">
            <div className="booking-arrival-time">{arrivalTime}</div>
            <div className="booking-arrival-location">{to}</div>
          </div>
        </div>
        <div className="booking-dates pb-6">
          <div className="booking-date-info">
            <h6 className="date-label">Departure</h6>
            <h5 className="date-text">{date}</h5>
          </div>
          <div className="vr-line"></div>
          <div className="booking-date-info">
            <h6 className="date-label">Arrival</h6>
            <h5 className="date-text">{date}</h5>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyFlightCard;
