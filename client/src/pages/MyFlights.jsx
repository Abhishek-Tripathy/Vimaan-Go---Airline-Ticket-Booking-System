import Navbar from '../components/Navbar';
import Nav2 from '../components/Nav2';
import Footer from '../components/Footer';
import MyFlightCard from '../components/MyFlightCard';
import Loading from '../components/Loading';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthContext from '../authContext';

function MyFlights() {
    const [myflights, setmyflights] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { isAuthenticated,backendUrl } = useContext(AuthContext)
      

    async function fetch_data() {
        try {
            const response = await fetch(backendUrl+'/api/getbookedflights', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });

            const data = await response.json();
            console.log("My flights data===", data);
            if (response.ok) {
                setmyflights(data.flights);
                setTimeout(() => {
                    setIsLoading(false)
                }, 1500);
            } else {
                console.log(data);
                toast.error(data.message || "Error Occurred");
                setTimeout(() => {
                    setIsLoading(false)
                }, 1500);
            }
        } catch (error) {
            toast.error("Network error, please try again later");
            setIsLoading(false);
        }
    }


    const fetchData = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(backendUrl+'/api/getuserdetails', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });
    
          const data = await response.json();
          console.log('User data: my flights', data);
    
          
        } catch (error) {
          toast.error('Network error, please try again later');
          console.error('Fetch error:', error);
        } finally {
          setTimeout(() => setIsLoading(false), 1500);
        }
      };


    useEffect(() => {
        if({isAuthenticated})fetch_data();
        setTimeout(() => {
            setIsLoading(false)
        }, 1500);
    }, []);

    return (
        <div>
            <div className={isLoading ? 'loading' : 'loaded'}>
                <Loading isLoading={isLoading} />
                <div className="content_">
                    <Navbar />
                    <Nav2>My Flights</Nav2>
                    <div className='bg-slate-100 pt-4 pb-4'>
                    {
                        !isAuthenticated ? (
                            <div className='text-4xl text-center'>
                                Login First to visit Flights.
                                Click <a className='underline' href='/login'>here</a> to login now.
                                </div>
                        ) : (        
                            <div>
                                {myflights.map((flightData, index) => {
                                    return <MyFlightCard key={index} flightData={flightData.flightId} bookingId={flightData._id} />
                                })}
                            </div>
                        )
                    }
                    </div>
                    <Footer/>
                </div>
            </div>
        </div>
    );
}

export default MyFlights;
