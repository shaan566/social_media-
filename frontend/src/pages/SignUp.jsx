import React from 'react'
import { useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { MdOutlineMailOutline } from "react-icons/md";
import { GoLock } from "react-icons/go";
import { useNavigate } from 'react-router-dom';
import { FaUser } from "react-icons/fa";
import FloatingDecorations from "../common/FloatingDecorations"

const SignUp = () => {    

      const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
    const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit  = () => {
    // e.preventDefault();
    // Add login logic here
    console.log('Email:', email);
    console.log('Password:', password);
    setEmail('');
    setPassword('');
  }
  return (
     <div className='flex flex-col items-center py-10 px-20 gap-3'>
          <h1 className='text-black text-3xl '>Create your account</h1>
          <p className='text-gray-600'>Already have an account?
         <span className="text-blue-500 hover:underline cursor-pointer"
         onClick={() => navigate('/login')}>Sign in</span></p>
          <div className='flex flex-col gap-3 w-96'>
            <label className='label'>Username</label>
            <div className="flex flex-rows items-center relative">
              <FaUser className="absolute left-3 top-2.5 text-gray-600" size={20}/>
              <input 
              type="text" 
              placeholder='Enter your username' 
              className='border border-gray-300 rounded-md p-2 px-10 w-full'
          value = {name}
          onChange = {(e) => setName(e.target.value)}
            />
            </div>
            <label className='label'>Email</label>
            <div className="flex flex-rows items-center relative">
              <MdOutlineMailOutline className="absolute left-3 top-2.5 text-gray-600" size={20}/>
              <input 
              type="email" 
              placeholder='Enter your email' 
              className='border border-gray-300 rounded-md p-2 px-10 w-full'
          value = {email}
          onChange = {(e) => setEmail(e.target.value)}
            />
            </div>
            <label className='label'>Password</label>
            <div className="flex flex-rows items-center relative">
              <GoLock className="absolute left-3 top-2.5 text-gray-600" size={20}/>
              <input 
              type={showPassword ? "text" : "password"} 
              placeholder='Enter your password' 
              className='border border-gray-300 rounded-md p-2 px-10 w-full'
              value = {password}
              onChange = {(e) => setPassword(e.target.value)}
              />
              <span onClick={togglePasswordVisibility} className="absolute right-3 top-2.5 cursor-pointer text-gray-600">
                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </span>
              
            </div>
            <label className='label'>Confirm Password</label>
            <div className="flex flex-rows items-center relative">
              <GoLock className="absolute left-3 top-2.5 text-gray-600" size={20}/>
              <input 
              type={showPassword ? "text" : "password"} 
              placeholder='Confirm your password' 
              className='border border-gray-300 rounded-md p-2 px-10 w-full'
              value = {password}
              onChange = {(e) => setPassword(e.target.value)}
              />
              <span onClick={togglePasswordVisibility} className="absolute right-3 top-2.5 cursor-pointer text-gray-600">
                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </span>
              
            </div>
          <div className="flex items-center relative">
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" className="mr-2" />
              <span className="text-gray-600 text-sm">
                I agree to the Terms and Conditions and Privacy Policy
              </span>
            </label>
          </div>
            
            <button 
            className='bg-blue-500 text-white rounded-md p-2 mt-4 hover:bg-blue-600'
            onClick={() => navigate('/otp')}>
            Submit
            </button>
           
          </div>
          <div className='hidden md:block'>
        <FloatingDecorations side="both" />
          </div>
        </div>
  )
}

export default SignUp
