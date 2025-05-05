import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import AuthContext from "../authContext";

function SearchForm({ setViewFlightData }) {

    const { backendUrl } = useContext(AuthContext);
  

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    date: "",
    category: "",
  });

  const changeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(backendUrl+"/api/searchFlight", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.status === 200) {
        setViewFlightData(data.flights);
        navigate("/view_flights");
      } else {
        toast.error(data.message || "Error Occurred");
      }
    } catch (error) {
      console.error(error);
      toast.error("Network error, please try again later");
    }
  };

  const viewAllFlights = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(backendUrl+"/api/searchAllFlights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.status === 200) {
        setViewFlightData(data.flights);
        navigate("/view_flights");
      } else {
        toast.error(data.message || "Error Occurred");
      }
    } catch (error) {
      console.error(error);
      toast.error("Network error, please try again later");
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-400 to-indigo-400 py-12">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="container mx-auto px-4"
      >
        <form
          onSubmit={submitHandler}
          className="bg-white shadow-2xl rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-sm font-semibold text-gray-800 mb-2">From:</label>
              <input
                type="text"
                placeholder="Enter departure city"
                name="from"
                onChange={changeHandler}
                value={formData.from}
                required
                aria-label="Departure city"
                className="w-full border-2 border-gray-200 rounded-lg py-3 px-4 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 hover:border-indigo-300"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-semibold text-gray-800 mb-2">To:</label>
              <input
                type="text"
                placeholder="Enter destination city"
                name="to"
                onChange={changeHandler}
                value={formData.to}
                required
                aria-label="Destination city"
                className="w-full border-2 border-gray-200 rounded-lg py-3 px-4 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 hover:border-indigo-300"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-semibold text-gray-800 mb-2">Date:</label>
              <input
                type="date"
                name="date"
                onChange={changeHandler}
                value={formData.date}
                required
                aria-label="Travel date"
                className="w-full border-2 border-gray-200 rounded-lg py-3 px-4 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 hover:border-indigo-300"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-sm font-semibold text-gray-800 mb-2">Category:</label>
              <select
                name="category"
                onChange={changeHandler}
                value={formData.category}
                required
                aria-label="Flight category"
                className="w-full border-2 border-gray-200 rounded-lg py-3 px-4 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 hover:border-indigo-300"
              >
                <option value="">Select Category</option>
                <option value="Economy">Economy</option>
                <option value="Business">Business</option>
                <option value="First">First</option>
              </select>
            </motion.div>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium text-sm hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all duration-300 w-full sm:w-auto"
            >
              View Flights
            </motion.button>
            <motion.button
              onClick={viewAllFlights}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-teal-500 text-white py-3 px-6 rounded-lg font-medium text-sm hover:bg-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-300 transition-all duration-300 w-full sm:w-auto"
            >
              View All Flights
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default SearchForm;