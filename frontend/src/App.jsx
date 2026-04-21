import React from 'react'

import './App.css'

import Hero from './components/home/Hero.jsx'
import Login from './pages/auth/Login.jsx'
import Resetpassworld from './pages/auth/Resetpassworld.jsx'
import ComingSoon from './components/common/ComingSoon.jsx'
import MainLayout from "./layouts/MainLayout";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignUp from './pages/auth/SignUp.jsx';
import Otp from './pages/auth/Otp.jsx';
import Schedule from './pages/Schedule.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Layout from "./components/common/Layout.jsx"
import Analytics from './pages/Analytics.jsx'
import Createideas from './Modals/Createideas.jsx'

import Create from './pages/Create.jsx'



const App = () => {
  return (
    <BrowserRouter>
  <Routes>
    <Route element={<MainLayout />}>
      <Route path="/" element={<Hero />} />
      
      <Route path="/features" element={<ComingSoon />} />
      <Route path="/channels" element={<ComingSoon />} />
      <Route path="/resources" element={<ComingSoon />} />
      <Route path="/madefor" element={<ComingSoon />} />
      <Route path="*" element={<ComingSoon />} />
      
    </Route>
    <Route>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/reset-password" element={<Resetpassworld />} />
      <Route path="/otp" element={<Otp />} />
    </Route>
    <Route element={<Layout />}>
       <Route path="/create" element={<Create />} /> 
       <Route path="/dashboard" element= {<Dashboard/>} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/analytics" element={<Analytics />} /> 
          <Route path= "/createideas" element= {<Createideas/>} />
    </Route>
  </Routes>
</BrowserRouter>
  )
}

export default App
