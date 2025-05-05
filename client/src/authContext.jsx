import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setuserName] = useState("");
  const [email, setEmail] = useState("");
 
  const backendUrl = import.meta.env.VITE_BACKEND_URL;


  // const fetchFlights = async () => {
  //     try {
  //       const response = await fetch(backendUrl+"/api/admin/getallflights", {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //       });
  //       const data = await response.json();
  //       setTotalFligths(data.flights)
  //       console.log("data" , data.flights.length)

  //       if (response.ok) {
    
  //       } else {
  //         toast.error(data.message || "Failed to fetch flights");
  //       }
  //     } catch (error) {
  //       toast.error("Network error, please try again later");
  //       console.error("Network error: at auth context: ", error);
  //     }
  //   };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      verifyToken(token);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      const response = await axios.get(backendUrl+'/api/auth/verify', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Verify token" ,response);
      setuserName(response.data.username)
      setEmail(response.data.email)
      setIsAuthenticated(response.status === 200);
    } catch (error) {
      setIsAuthenticated(false);
    }
  };

  const login = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{backendUrl, userName,email,isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

