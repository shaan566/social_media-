import React from 'react'

import './App.css'

import Hero from './components/home/Hero.jsx'
import Login from './pages/login.jsx'
import ComingSoon from './pages/ComingSoon.jsx'
import MainLayout from "./layouts/MainLayout";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignUp from './pages/SignUp.jsx';


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
    </Route>
    <Route>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
    </Route>
  </Routes>
</BrowserRouter>
  )
}

export default App
