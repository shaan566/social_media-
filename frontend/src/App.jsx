import React from 'react'

import './App.css'

import Hero from './components/home/Hero.jsx'
import Login from './pages/auth/Login.jsx'
import Resetpassworld from './pages/auth/Resetpassworld.jsx'
import ComingSoon from './pages/ComingSoon.jsx'
import MainLayout from "./layouts/MainLayout";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignUp from './pages/auth/SignUp.jsx';
import Otp from './pages/auth/Otp.jsx';
import Dashboard from './pages/Dashboard.jsx'



const App = () => {
  return (
    <BrowserRouter>
  <Routes>
    <Route element={<MainLayout />}>
      <Route path="/" element={<Hero />} />
      
      <Route path="/features" element={<ComingSoon />} />
      <Route path="/channels" element={<ComingSoon />} />
      <Route path="/resources" element={<ComingSoon />} />
      <Route path="/messages" element={<ComingSoon />} />
      <Route path="*" element={<ComingSoon />} />
      <Route path="/dashboard" element= {<Dashboard/>} />
    </Route>
    <Route>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/reset-password" element={<Resetpassworld />} />
      <Route path="/otp" element={<Otp />} />
    </Route>
  </Routes>
</BrowserRouter>
  )
}

export default App
