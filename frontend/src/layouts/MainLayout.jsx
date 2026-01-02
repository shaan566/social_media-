import React from 'react'
import Header from '../components/common/Header.jsx'
import Footer from '../components/common/Footer.jsx'
import { Outlet } from "react-router-dom";


const MainLayout = () => {
  return (
    <>
     <Header />
     <Outlet />
     <Footer />
    </>
  )
}

export default MainLayout
