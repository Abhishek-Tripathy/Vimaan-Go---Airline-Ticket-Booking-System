import React, { useContext, useState } from "react";
import Layout from "./Layout";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";
import AuthContext from "../../authContext";

const AddFlight = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { backendUrl } = useContext(AuthContext);

  // Simulate loading (replace with actual API call if needed)
  setTimeout(() => {
    setIsLoading(false);
  }, 1500);

  const [flightDetails, setFlightDetails] = useState({
    flightNo: "",
    to: "",
    from: "",
    category: "",
    totalSeats: "",
    totalPrice: "",
    date: "",
    departureTime: "",
    arrivalTime: "",
    airline: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFlightDetails((prevDetails) => ({
      ...prevDetails,
      [name]:
        name === "totalSeats" || name === "totalPrice" ? parseFloat(value) || "" : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(backendUrl+"/api/admin/addflight", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(flightDetails),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Successfully Added Flight");
        navigate("/admin_dashboard");
      } else {
        toast.error(data.message || "Authentication failed");
      }
    } catch (error) {
      toast.error("Network error, please try again later");
      console.error("Network error:", error);
    }
  };

  const handleCancel = () => {
    navigate("/admin_dashboard");
  };

  return (
    <div className={isLoading ? "opacity-50" : "opacity-100"}>
      <Loading isLoading={isLoading} />
      <div className="container mx-auto px-4 py-6">
        <Layout>
          <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 max-w-4xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800 text-center">
              Add Flight
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">From:</label>
                  <input
                    type="text"
                    name="from"
                    value={flightDetails.from}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">To:</label>
                  <input
                    type="text"
                    name="to"
                    value={flightDetails.to}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Airline:</label>
                  <input
                    type="text"
                    name="airline"
                    value={flightDetails.airline}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Flight No.:</label>
                  <input
                    type="text"
                    name="flightNo"
                    value={flightDetails.flightNo}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category:</label>
                  <select
                    name="category"
                    value={flightDetails.category}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select Category</option>
                    <option value="Economy">Economy</option>
                    <option value="Business">Business</option>
                    <option value="First">First</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Total Seats:</label>
                  <input
                    type="number"
                    name="totalSeats"
                    value={flightDetails.totalSeats}
                    onChange={handleChange}
                    required
                    min="0"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price:</label>
                  <input
                    type="number"
                    name="totalPrice"
                    value={flightDetails.totalPrice}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date:</label>
                  <input
                    type="date"
                    name="date"
                    value={flightDetails.date}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Departure Time:</label>
                  <input
                    type="time"
                    name="departureTime"
                    value={flightDetails.departureTime}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Arrival Time:</label>
                  <input
                    type="time"
                    name="arrivalTime"
                    value={flightDetails.arrivalTime}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-sm"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </Layout>
      </div>
    </div>
  );
};

export default AddFlight;