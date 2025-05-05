// Checkout.jsx
import React, { useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import axios from 'axios'
import AuthContext from '../authContext';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";



const Checkout = async ({ bookFlightData }) => {
  const {userName, backendUrl} = useContext(AuthContext)
  const navigate = useNavigate();
  const location = useLocation();
  const { price, discount, passengers, flightNo } = location.state || {};

  const handleSubmit = (e) => {
    e.preventDefault();
    bookFlight(); // Directly call the booking function

  };

  const bookFlight = async () => {
    console.log("Flight booked successfully with data:", bookFlightData);
    alert("Your flight has been successfully booked!");

    try {
      const response = await axios.post( backendUrl +
        '/api/bookflight',
        {
                // Send flight number
          username: userName,       // Send username
          passengers,
          flightNo, 
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      console.log(response.data)
      console.log("Passengers: ", passengers)
      toast.success(response.data.message);
      navigate('/my_flights');
    } catch (error) {
      console.log("Checkout page error: " , error)
      toast.error(error.message)
    }
  };

  

  console.log("Passenders: ", passengers)
  console.log("Flight no: ", flightNo)

  return (
    <div className="container">
      <Navbar />
      <div className="min-h-screen flex items-center relative justify-center p-4 sm:p-6 md:p-8">
        <div className="bg-gradient-to-b from-slate-600 to-gray-400 rounded-3xl w-full max-w-md shadow-lg overflow-auto p-6 sm:p-8">
          <header className="flex justify-center py-2 px-4">
            <h1 className="text-xl sm:text-2xl font-poppin">Checkout</h1>
          </header>

          <form onSubmit={handleSubmit} className="grid gap-6 sm:gap-8">
            <fieldset className="border-0 m-0 p-0">
              <legend className="font-semibold mb-2 text-sm sm:text-base">
                Payment Method
              </legend>
              {/* Payment options can remain for display purposes */}
            </fieldset>

            <div>
              <h1 className="text-xl sm:text-lg text-black italic mb-2">Shopping Bill</h1>
              <table className="w-full border-collapse text-sm sm:text-base">
                <tbody className="text-[#0e0d0d]">
                  <tr>
                    <td className="py-1">Shipping fee</td>
                    <td className="py-1 text-right">${price}</td>
                  </tr>
                  <tr>
                    <td className="py-1">Discount {discount}%</td>
                    <td className="py-1 text-right">-${(price * discount) / 100}</td>
                  </tr>
                  <tr>
                    <td className="py-1">Price Total</td>
                    <td className="py-1 text-right">${price - (price * discount) / 100}</td>
                  </tr>
                  <tr>
                    <td className="py-1">GST: </td>
                    <td className="py-1 text-right">+18%</td>
                  </tr>
                </tbody>
                <tfoot className="border-t border-[#b4b4b4] font-semibold">
                  <tr>
                    <td className="py-1">Total</td>
                    <td className="py-1 text-right">
                      ${price - (price * discount) / 100 + (price - (price * discount) / 100) * 0.18}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-[#fc8080] text-white rounded-full py-3 px-4 hover:bg-[#e96363] transition duration-300 text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current">
                  <use xlinkHref="#icon-shopping-bag" />
                </svg>
                Buy Now
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
