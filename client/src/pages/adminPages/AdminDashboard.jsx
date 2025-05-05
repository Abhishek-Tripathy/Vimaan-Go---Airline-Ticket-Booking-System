import React, { useContext, useEffect, useState } from "react";
import Layout from "./Layout";
import Loading from "../../components/Loading";
import "../../CSS/admindash.css";
import { toast } from "react-toastify";


const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [totalFligths, setTotalFligths] = useState([])
  const [totalBookedFligths, setTotalBookedFligths] = useState([])
  const backendUrl = import.meta.env.VITE_BACKEND_URL;


  const fetchFlights = async () => {
    try {
      const response = await fetch(backendUrl+"/api/admin/getallflights", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setTotalFligths(data.flights)
      console.log("data" , data.flights.length)

      if (response.ok) {
        
      } else {
        toast.error(data.message || "Failed to fetch flights");
      }
    } catch (error) {
      toast.error("Network error, please try again later");
      console.error("Network error: at admin dahsboard: ", error);
    }
  };

  const fetchBookedFlights = async () =>  {
    try {
      const response = await fetch(backendUrl + "/api/getallbookedflights", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json(); // Parse the JSON data
    setTotalBookedFligths(data.flights)
    console.log("Booked all flights data: ", data);

    } catch (error) {
      toast.error("error, please try again");
      console.error("Network error: at admin dashboard: ", error);
    }
  }

  useEffect(()=> {
    fetchFlights()
    fetchBookedFlights()
  }, [])

  setTimeout(() => {
    setIsLoading(false);
  }, 1000);

  return (
    <div className={isLoading ? "loading" : "loaded"}>
      <Loading isLoading={isLoading} />
      <div className="content_">
        <Layout>
          <div className="container_dash">
            <div className="box-dash">
              <h2>Total Flights</h2>
              <h5>{totalFligths.length}</h5>
            </div>
            <div className="box-dash">
              <h2>Booked Flights</h2>
              <h5>{totalBookedFligths.length}</h5>
            </div>
          </div>
        </Layout>
      </div>
    </div>
  );
};

export default AdminDashboard;
