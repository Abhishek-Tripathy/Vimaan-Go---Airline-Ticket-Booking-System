import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/Navbar';
import Loading from '../components/Loading';
import { motion, AnimatePresence } from 'framer-motion';
import AuthContext from '../authContext';

function UserProfile() {
  const [userData, setUserData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    address: '',
  });

  const { login,backendUrl } = useContext(AuthContext);
  
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
      console.log('User data:', data);

      if (response.ok) {
        setUserData(data.user);
        setFormData({
          firstName: data.user.firstName || '',
          lastName: data.user.lastName || '',
          mobile: data.user.mobile || '',
          address: data.user.address || '',
        });
      } else {
        toast.error(data.message || 'Failed to fetch user details');
      }
    } catch (error) {
      toast.error('Network error, please try again later');
      console.error('Fetch error:', error);
    } finally {
      setTimeout(() => setIsLoading(false), 1500);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const changeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.firstName) return 'First Name is required';
    if (!formData.lastName) return 'Last Name is required';
    if (!/^\d{10}$/.test(formData.mobile)) return 'Mobile number must be 10 digits';
    if (!formData.address) return 'Address is required';
    return null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(backendUrl+'/api/updateuserdetails', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setUserData(data.user);
        setIsEditing(false);
        toast.success('Profile updated successfully!');
      } else {
        toast.error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('Network error, please try again later');
      console.error('Update error:', error);
    } finally {
      setTimeout(() => setIsLoading(false), 1500);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.3 } },
    tap: { scale: 0.95 },
  };

  return (
    <div className={isLoading ? 'min-h-screen flex items-center justify-center' : 'flex flex-col min-h-screen'}>
      <Loading isLoading={isLoading} />
      <div className={isLoading ? 'hidden' : 'flex-grow'}>
        <Navbar />
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg"
        >
          {!isEditing ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-center">User Profile</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-600">First Name</span>
                  <span className="text-gray-800">{userData.firstName || 'N/A'}</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-600">Last Name</span>
                  <span className="text-gray-800">{userData.lastName || 'N/A'}</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-600">Mobile</span>
                  <span className="text-gray-800">{userData.mobile || 'N/A'}</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-600">Address</span>
                  <span className="text-gray-800">{userData.address || 'N/A'}</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-600">Username</span>
                  <span className="text-gray-800">{userData.username || 'N/A'}</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-600">Email</span>
                  <span className="text-gray-800">{userData.email || 'N/A'}</span>
                </div>
              </div>
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => setIsEditing(true)}
                className="w-full px-6 py-2 text-white bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                aria-label="Edit Profile"
              >
                Edit
              </motion.button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-2xl font-semibold text-center">Edit Profile</h2>
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={changeHandler}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="First Name"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={changeHandler}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Last Name"
                />
              </div>
              <div>
                <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
                  Mobile
                </label>
                <input
                  id="mobile"
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={changeHandler}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Mobile Number"
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  id="address"
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={changeHandler}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Address"
                />
              </div>
              <div className="flex justify-between space-x-4">
                <motion.button
                  type="submit"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="flex-1 px-6 py-2 text-white bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                  aria-label="Update Profile"
                >
                  Update
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="flex-1 px-6 py-2 text-white bg-gray-600 rounded-lg font-semibold hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-300"
                  aria-label="Cancel Edit"
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default UserProfile;