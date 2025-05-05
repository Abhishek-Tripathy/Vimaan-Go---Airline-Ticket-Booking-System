import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { useState } from 'react';

function Footer(){

const [input, setInput] = useState("")

const thanks = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email validation regex

    if (input.length === 0) {
        toast.error("Fill out the empty field");
    } else if (!emailRegex.test(input)) {
        toast.error("Please enter a valid email address");
    } else {
        toast.success("Thanks for Subscribing");
        setInput("");
    }
};



    return(  
        <footer className="bg-white">
            <div className="container-fluid">
                <div className="row flex flex-col xs:flex-row sm:flex-row flex-wrap px-[1rem] sm:px-[5rem] xs:py-[3.5rem] xs:space-x-[2rem]">
                    <div className="flex-1 xs:pr-[2rem] space-y-5 py-[2rem] xs:pl-[2rem]">
                        <a href="/"><img src="/logo.png" alt="#" className=""></img></a>
                        <p className="">FLY Now offers seamless flight booking with great prices, excellent service, and an easy-to-use platform. Travel made simple and stress-free!</p>
                        <h6 className="font-semibold">Subscribe to our special offers</h6>
                        <div>
                            <input value={input} onChange={(e)=>setInput(e.target.value)} type="email" className="w-full h-[2.3rem] p-[0.5rem] border-[2px] rounded" placeholder="Email address" ></input>
                            <button onClick={thanks} className="inline text-white rounded text-xl mt-6 font-bold p-2 sm:w-[10rem] transition duration-500 ease-in-out bg-blue-600 hover:bg-slate-300 hover:text-black transform hover:-translate-y-1 hover:scale-110 ...">
                                Subscribe
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 space-y-6 pl-2 py-[2rem]">
                        <h4 className="text-[2rem] font-medium">Booking</h4>
                        <div className="our-links">
                            <ul className="unstyled space-y-5">
                                <li className=""><Link to={"/book_flight"} className="light-black">Book Flights</Link>
                                </li>
                                <li className=""><Link to={"/my_flights"} className="light-black">Manage Bookings</Link>
                                </li>
                                <li className=""><Link to={"/notAvailable"} className="light-black">Travel Services</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="flex-1 space-y-6 py-[2rem]">
                        <h4 className="text-[2rem] font-medium">Useful Links</h4>
                        <div className="our-links">
                            <ul className="unstyled space-y-5">
                                <li className=""><Link to={"/home"} className="">Home</Link>
                                </li>
                                <li className=""><Link to={"/about"} className="">About</Link></li>
                                <li className=""><Link to={"/contact"} className="">Contact Us</Link></li>
                            </ul>
                        </div>
                    </div>
                    
                    <div className="flex-1 space-y-6 sm:py-[2rem]">
                        <h4 className="text-[2rem] font-medium">Contact Us</h4>
                        <div className="follow-us">
                            <ul className="unstyled space-y-5">
                                <li className=""><FontAwesomeIcon icon={faLocationDot}/>&nbsp;&nbsp;123
                                    Main Street, Anytown, USA.</li>
                                <li className="text-blue-500 lg:text-[1.5rem]"><FontAwesomeIcon icon={faPhone}/>&nbsp;&nbsp;+1 234 567 890</li>
                                <li className=""><a href="/"><FontAwesomeIcon icon={faEnvelope}/>&nbsp;&nbsp;email@example.com</a></li>
                            </ul>
                        </div>
                        <div className="">
                            <h6 className="text-[2rem] font-medium">Follow Us!</h6>
                            {/* <ul className="unstyled">
                                <li><a href="" class="active"><img src="#" alt=""></img></a></li>
                                <li><a href=""><img src="#" alt=""></img></a></li>
                                <li><a href=""><img src="#" alt=""></img></a></li>
                                <li><a href=""><img src="#" alt=""></img></a></li>
                            </ul> */}
                        </div>
                        <p className="">©2023 FlyNow All Rights Reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    
    );
}

export default Footer;