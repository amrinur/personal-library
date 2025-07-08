import { Outlet } from "react-router-dom"

import Navbar from "../components/Navbar"

const Mainlayout = () => {
  return (
    <div className='w-full h-screen'>
    <Navbar />
    <Outlet />
    </div>
  )
}

export default Mainlayout