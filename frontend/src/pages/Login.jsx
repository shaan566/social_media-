import React from 'react'
import { useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { MdOutlineMailOutline } from "react-icons/md";
import { GoLock } from "react-icons/go";
import { useNavigate } from 'react-router-dom';
import FloatingDecorations from "../components/home/FloatingDecorations";

const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = () => {
    // e.preventDefault();
    // Add login logic here
    console.log('Email:', email);
    console.log('Password:', password);
    setEmail('');
    setPassword('');
  }
  return (
    <div className='flex flex-col items-center py-30 px-20 gap-6'>
      <h1 className='text-black text-3xl '>Log in to your account</h1>
      <p className='text-gray-600'>Welcome back! Please enter your details.</p>
      <div className='flex flex-col gap-3 w-96'>
        <label className='text-black text-lg font-medium'>Email</label>
        <div className="flex flex-rows items-center relative">
          <MdOutlineMailOutline className="absolute left-3 top-2.5 text-gray-600" size={25}/>
          <input 
          type="email" 
          placeholder='Enter your email' 
          className='border border-gray-300 rounded-md p-2 px-10 w-full'
      value = {email}
      onChange = {(e) => setEmail(e.target.value)}
        />
        </div>
        <label className='text-black text-lg font-medium'>Password</label>
        <div className="flex flex-rows items-center relative">
          <GoLock className="absolute left-3 top-2.5 text-gray-600" size={25}/>
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
       
        
        <button 
        className='bg-blue-500 text-white rounded-md p-2 mt-4 hover:bg-blue-600'
        onClick={handleLogin}>Log In</button>
        <h3 className='text-gray-600'>
          Don't have an account?
         <span className="text-blue-500 hover:underline cursor-pointer"
         onClick={() => navigate('/signup')}>Sign up</span>
        </h3>
      </div>
      <div className='hidden md:block'>
        <FloatingDecorations side="both" />
      </div>
    </div>
    
  )
}

export default Login
