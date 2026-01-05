import React from 'react'
import { useState } from 'react'
import { MdOutlineMailOutline } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import FloatingDecorations from "../common/FloatingDecorations";

const Resetpassworld = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
    }
  return (
     <div className='flex flex-col items-center py-30 px-20 gap-6'>
          <h1 className='text-black text-3xl '>Reset your password</h1>
          <p className='text-gray-600'>Enter your email address and we'll send you a link to reset your password.</p>
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
            
            <button 
            className='bg-blue-500 text-white rounded-md p-2 mt-4 hover:bg-blue-600'
            onClick={() => navigate('/otp')}>
                Send OTP
            </button>
            <div className='flex justify-center mt-10'>
            <h3 className='text-gray-600 '>
              Remember your password?
             <span className="text-blue-500 hover:underline cursor-pointer"
             onClick={() => navigate('/login')}>Back to login</span>
            </h3> 
            </div>
          </div>
          <div className='hidden md:block'>
            <FloatingDecorations side="both" />
          </div>
        </div>
  )
}

export default Resetpassworld