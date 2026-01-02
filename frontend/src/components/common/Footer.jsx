import React from "react";

import { FaLinkedin } from "react-icons/fa";
import { FaSquareInstagram } from "react-icons/fa6";
import { ImGithub } from "react-icons/im";
import { RiTwitterXFill } from "react-icons/ri";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div>
       <footer className="px-6 bg-gray-900 md:px-16 lg:px-24 xl:px-32 pt-8 w-full">
            <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-500/30 pb-6">
                 <div className="flex flex-col items-center md:flex-row justify-between space-y-6 md:space-y-0 -translate-y-5">
                              <div className="space-y-2">
                                <ul className="flex space-x-5">
                                  <li>
                                    <a href="https://x.com/ch60868207" target="_blank" rel="noopener noreferrer">
                                      <div className="rounded-full bg-gray-800 p-3 ">
                                        <RiTwitterXFill size={24} />
                                      </div>
                                    </a>
                                  </li>
                                  <li>
                                    <a href="https://www.linkedin.com/in/shaan510/" target="_blank" rel="noopener noreferrer">
                                      <div className="rounded-full bg-gray-800 p-3 ">
                                        <FaLinkedin size={24} />
                                      </div>
                                    </a>
                                  </li>
                                  <li>
                                    <a href="https://www.instagram.com/learn_code147/?hl=en" target="_blank" rel="noopener noreferrer">
                                      <div className="rounded-full bg-gray-800 p-3 ">
                                        <FaSquareInstagram size={24} />
                                      </div>
                                    </a>
                                  </li>
                                  <li>
                                    <a href="https://github.com/shaan566" target="_blank" rel="noopener noreferrer">
                                      <div className="rounded-full bg-gray-800 p-3 ">
                                        <ImGithub size={24} />
                                      </div>
                                    </a>
                                  </li>
                                </ul>
                              </div>
                            </div>
                <div className="flex-1 flex items-start md:justify-end gap-20">
                    <div>
                        <h2 className="font-semibold mb-5">Company</h2>
                        <ul className="text-sm space-y-2">
                            <li><Link to="/features">Features</Link></li>
                            <li><Link to="/channels">Channels</Link></li>
                            <li><Link to="/resources">Resources</Link></li>
                            <li><Link to="/messages">Messages</Link></li>
                            <li><Link to="/">Privacy policy</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="font-semibold  mb-5">Subscribe to our newsletter</h2>
                        <div className="text-sm space-y-2">
                            <p>The latest news, articles, and resources, sent to your inbox weekly.</p>
                            <div className="flex items-center gap-2 pt-4">
                                <input className="border border-gray-500/30 placeholder-gray-500 focus:ring-2 ring-indigo-600 outline-none w-full max-w-64 h-9 rounded px-2" type="email" placeholder="Enter your email" />
                                <button className="bg-blue-600 w-24 h-9 text-white rounded">Subscribe</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <p className="pt-4 text-center text-xs md:text-sm pb-5">
                {new Date().getFullYear()} All Right Reserved.
            </p>
        </footer>
    </div>
  )
}

export default Footer
