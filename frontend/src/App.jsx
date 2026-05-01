import React, { Suspense } from "react"
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom"

import './App.css'

import { useAuth } from './hooks/useAuth'

// Pages
import Hero from './components/home/Hero.jsx'
import Login from './pages/auth/Login.jsx'
import Resetpassworld from './pages/auth/Resetpassworld.jsx'
import SignUp from './pages/auth/SignUp.jsx'
import Otp from './pages/auth/Otp.jsx'

import Schedule from './pages/Schedule.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Analytics from './pages/Analytics.jsx'
import Create from './pages/Create.jsx'
import Createideas from "./Modals/CreateModal/Createideas.jsx"
// import Createideas from '../modals/CreateModal/Createideas.jsx'


// Layouts
import MainLayout from "./layouts/MainLayout"
import Layout from "./components/common/Layout"

// Common
import ComingSoon from './components/common/ComingSoon'


const RouteLoadingFallback = () => <div>Loading...</div>

const ProtectedRoute = ({
  children,
 
  
}) => {
  const { isAuthenticated, user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) return <RouteLoadingFallback />

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    )
  }

  

  if (user && !user.emailVerified) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location,
          message: "Please verify your email",
        }}
        replace
      />
    )
  }

  return children
}


const AuthRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) return <RouteLoadingFallback />

  if (isAuthenticated) {
    return <Navigate to="/create"/>
  }

  return children
}

const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteLoadingFallback />}>
        <Routes>

          {/* 🌐 Public Layout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Hero />} />
            <Route path="/features" element={<ComingSoon />} />
            <Route path="/channels" element={<ComingSoon />} />
            <Route path="/resources" element={<ComingSoon />} />
            <Route path="/madefor" element={<ComingSoon />} />
          </Route>

          {/* 🔐 Auth Routes */}
          <Route>
            <Route path="/login" element={
              <AuthRoute><Login /></AuthRoute>
            } />
            <Route path="/signup" element={
              <AuthRoute><SignUp /></AuthRoute>
            } />
            <Route path="/reset-password" element={<Resetpassworld />} />
            <Route path="/otp" element={<Otp />} />
          </Route>

          {/* 🔒 Protected App */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={
              <ProtectedRoute><Dashboard /></ProtectedRoute>
            } />

            <Route path="/create" element={
              <ProtectedRoute><Create /></ProtectedRoute>
            } />

            <Route path="/schedule" element={
              <ProtectedRoute><Schedule /></ProtectedRoute>
            } />

            <Route path="/analytics" element={
              <ProtectedRoute><Analytics /></ProtectedRoute>
            } />

            <Route path="/createideas" element={
              <ProtectedRoute><Createideas /></ProtectedRoute>
            } />
          </Route>

          {/* ❌ Catch all */}
          <Route path="*" element={<ComingSoon />} />

        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App