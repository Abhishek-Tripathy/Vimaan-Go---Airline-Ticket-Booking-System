import React, { useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/Navbar';
import Nav2 from '../components/Nav2';
import Footer from '../components/Footer';
import AuthContext from '../authContext';
import Loading from '../components/Loading';
import { motion, AnimatePresence } from 'framer-motion';

function Contact({ username }) {
  const { isAuthenticated,backendUrl } = useContext(AuthContext); // Correctly destructure isAuthenticated
     
  
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    mobile: '',
    username: username || '',
  });

  // Handle loading state
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const changeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.name) return 'Name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Valid email is required';
    if (!/^\d{10}$/.test(formData.mobile)) return 'Mobile number must be 10 digits';
    if (!formData.subject) return 'Subject is required';
    if (!formData.message) return 'Message is required';
    return null;
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    // Validate form
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      setIsLoading(false);
      return;
    }

    // Check authentication
    if (!isAuthenticated) {
      toast.error('Please log in to send a message');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(backendUrl+'/api/feedback/addFeedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Message sent successfully');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          mobile: '',
          username: username || '',
        });
      } else {
        toast.error(data.message || 'Failed to send message');
      }
    } catch (error) {
      toast.error('Network error, please try again later');
      console.error('Submission error:', error);
    } finally {
      setTimeout(() => setIsLoading(false), 2000);
    }
  };

  const fieldVariants = {
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
        <Nav2>Contact Us</Nav2>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen bg-blue-100 flex items-center justify-center py-10"
        >
          <motion.div
            variants={fieldVariants}
            initial="hidden"
            animate="visible"
            className="max-w-lg w-full mx-auto p-6 bg-white rounded-2xl shadow-lg"
          >
            <form onSubmit={submitHandler} className="space-y-6">
              <h2 className="text-2xl font-semibold text-center">Contact Us</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.div variants={fieldVariants}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    onChange={changeHandler}
                    value={formData.name}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Name"
                  />
                </motion.div>
                <motion.div variants={fieldVariants}>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={changeHandler}
                    value={formData.email}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Email"
                  />
                </motion.div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.div variants={fieldVariants}>
                  <input
                    type="tel"
                    name="mobile"
                    placeholder="Mobile No."
                    onChange={changeHandler}
                    value={formData.mobile}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Mobile Number"
                  />
                </motion.div>
                <motion.div variants={fieldVariants}>
                  <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    onChange={changeHandler}
                    value={formData.subject}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Subject"
                  />
                </motion.div>
              </div>
              <motion.div variants={fieldVariants}>
                <textarea
                  name="message"
                  placeholder="Message"
                  onChange={changeHandler}
                  value={formData.message}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-y"
                  aria-label="Message"
                />
              </motion.div>
              <div className="flex justify-center">
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className={`px-6 py-2 text-white bg-blue-600 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  aria-label="Send Message"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin h-5 w-5 mr-2 text-white"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    'Send Message'
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
        <Footer />
      </div>
    </div>
  );
}

export default Contact;