import React, { useContext, useEffect, useState } from "react";
import Layout from "./Layout";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";
import AuthContext from "../../authContext";

const FlightManage = () => {
  const [flights, setFlights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingFlight, setEditingFlight] = useState(null);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterAirline, setFilterAirline] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [sortKey, setSortKey] = useState("");
  const navigate = useNavigate();
  const { backendUrl } = useContext(AuthContext);

  const fetchFlights = async () => {
    try {
      const response = await fetch(backendUrl+"/api/admin/getallflights", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setFlights(data.flights);
        setIsLoading(false);
      } else {
        toast.error(data.message || "Failed to fetch flights");
      }
    } catch (error) {
      toast.error("Network error, please try again later");
      console.error("Network error:", error);
    }
  };

  useEffect(() => {
    fetchFlights();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this flight?")) return;
    try {
      const response = await fetch(backendUrl+`/api/admin/deleteflight/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message || "Flight deleted successfully");
        setFlights(data.flights);
      } else {
        toast.error(data.message || "Failed to delete flight");
      }
    } catch (error) {
      toast.error("Network error, please try again later");
      console.error("Network error:", error);
    }
  };

  const handleEdit = (flight) => {
    setEditingFlight(flight);
  };

  const handleCancelEdit = () => {
    setEditingFlight(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(backendUrl+`/api/admin/updateFlight/${editingFlight._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(editingFlight),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message || "Flight updated successfully");
        fetchFlights();
        setEditingFlight(null);
      } else {
        toast.error(data.message || "Failed to update flight");
      }
    } catch (error) {
      toast.error("Network error, please try again later");
      console.error("Network error:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingFlight((prevDetails) => ({
      ...prevDetails,
      [name]: name === "totalSeats" || name === "totalPrice" ? parseFloat(value) : value,
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === "category") setFilterCategory(value);
    if (name === "airline") setFilterAirline(value);
    if (name === "date") setFilterDate(value);
  };

  const handleSortChange = (e) => {
    setSortKey(e.target.value);
  };

  const filteredFlights = flights.filter(
    (flight) =>
      (filterCategory ? flight.category

 === filterCategory : true) &&
      (filterAirline ? flight.airline.toLowerCase().includes(filterAirline.toLowerCase()) : true) &&
      (filterDate ? flight.date.split("T")[0] === filterDate : true)
  );

  const sortedFlights = [...filteredFlights].sort((a, b) => {
    if (sortKey === "date") {
      return new Date(a.date) - new Date(b.date);
    } else if (sortKey === "airline") {
      return a.airline.localeCompare(b.airline);
    } else if (sortKey === "flightNo") {
      return a.flightNo.localeCompare(b.flightNo);
    } else if (sortKey === "seats") {
      return a.totalSeats - b.totalSeats;
    } else if (sortKey === "price") {
      return a.totalPrice - b.totalPrice;
    }
    return 0;
  });

  return (
    <div className={isLoading ? "opacity-50" : "opacity-100"}>
      <Loading isLoading={isLoading} />
      <div className="container mx-auto px-4">
        <Layout>
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Manage Flights</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div>
                <label htmlFor="filterCategory" className="block text-sm font-medium text-gray-700">
                  Filter by Category:
                </label>
                <select
                  id="filterCategory"
                  name="category"
                  value={filterCategory}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">All</option>
                  <option value="Economy">Economy Class</option>
                  <option value="Business">Business Class</option>
                  <option value="First">First Class</option>
                </select>
              </div>
              <div>
                <label htmlFor="filterAirline" className="block text-sm font-medium text-gray-700">
                  Filter by Airline:
                </label>
                <input
                  type="text"
                  id="filterAirline"
                  name="airline"
                  value={filterAirline}
                  onChange={handleFilterChange}
                  placeholder="Enter airline"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="filterDate" className="block text-sm font-medium text-gray-700">
                  Filter by Date:
                </label>
                <input
                  type La date
                  id="filterDate"
                  name="date"
                  value={filterDate}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="sort" className="block text-sm font-medium text-gray-700">
                  Sort by:
                </label>
                <select
                  id="sort"
                  value={sortKey}
                  onChange={handleSortChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">None</option>
                  <option value="date">Date</option>
                  <option value="airline">Airline</option>
                  <option value="flightNo">Flight No.</option>
                  <option value="seats">Seats</option>
                  <option value="price">Price</option>
                </select>
              </div>
            </div>
            {editingFlight ? (
              <div className="absolute inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                <div className="bg-white mt-80  rounded-lg p-6 max-w-lg w-full">
                  <form onSubmit={handleUpdate} className="space-y-4">
                    <h3 className="text-lg font-semibold">Edit Flight</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">From:</label>
                      <input
                        type="text"
                        name="from"
                        value={editingFlight.from}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">To:</label>
                      <input
                        type="text"
                        name="to"
                        value={editingFlight.to}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Airline:</label>
                      <input
                        type="text"
                        name="airline"
                        value={editingFlight.airline}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Flight No.:</label>
                      <input
                        type="text"
                        name="flightNo"
                        value={editingFlight.flightNo}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Category:</label>
                      <select
                        name="category"
                        onChange={handleChange}
                        value={editingFlight.category}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      >
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
                        value={editingFlight.totalSeats}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Price:</label>
                      <input
                        type="number"
                        name="totalPrice"
                        value={editingFlight.totalPrice}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date:</label>
                      <input
                        type="date"
                        name="date"
                        value={editingFlight.date.split("T")[0]}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Departure Time:</label>
                      <input
                        type="time"
                        name="departureTime"
                        value={editingFlight.departureTime}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Arrival Time:</label>
                      <input
                        type="time"
                        name="arrivalTime"
                        value={editingFlight.arrivalTime}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div className="flex space-x-4">
                      <button
                        type="submit"
                        className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Update
                      </button>
                      <button
                        type="button"
                        className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-[1000px] w-full border-collapse bg-white shadow-md rounded-lg">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Airline</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Flight No.</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">From</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">To</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Category</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Total Seats</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Price</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Date</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Departure Time</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Arrival Time</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedFlights.map((flight, index) => (
                      <tr
                        key={flight._id}
                        className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100`}
                      >
                        <td className="px-4 py-2 border-b text-sm text-gray-700">{flight.airline}</td>
                        <td className="px-4 py-2 border-b text-sm text-gray-700">{flight.flightNo}</td>
                        <td className="px-4 py-2 border-b text-sm text-gray-700">{flight.from}</td>
                        <td className="px-4 py-2 border-b text-sm text-gray-700">{flight.to}</td>
                        <td className="px-4 py-2 border-b text-sm text-gray-700">{flight.category}</td>
                        <td className="px-4 py-2 border-b text-sm text-gray-700">{flight.totalSeats}</td>
                        <td className="px-4 py-2 border-b text-sm text-gray-700">{flight.totalPrice}</td>
                        <td className="px-4 py-2 border-b text-sm text-gray-700">{flight.date.split("T")[0]}</td>
                        <td className="px-4 py-2 border-b text-sm text-gray-700">{flight.departureTime}</td>
                        <td className="px-4 py-2 border-b text-sm text-gray-700">{flight.arrivalTime}</td>
                        <td className="px-4 py-2 border-b text-sm text-gray-700">
                          <button
                            onClick={() => handleEdit(flight)}
                            className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 mr-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(flight._id)}
                            className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Layout>
      </div>
    </div>
  );
};

export default FlightManage;