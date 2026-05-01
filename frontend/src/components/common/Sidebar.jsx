import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { LiaLightbulb } from 'react-icons/lia'
import { CiCalendarDate } from 'react-icons/ci'
import { MdAnalytics } from 'react-icons/md'
import { IoChatbubblesOutline } from 'react-icons/io5'
import { FiArrowRightCircle } from "react-icons/fi";
import { FiArrowLeftCircle } from "react-icons/fi";
// import CreateMenu from '../../Modals/CreateModal/CreateMenu'

const channels = [
  { name: "My Twitter",   platform: "Twitter",   posts: 0, avatar: "https://placehold.co/28" },
  { name: "My Instagram", platform: "Instagram", posts: 3, avatar: "https://placehold.co/28" },
]

const navItems = [
  { label: "Create",    icon: LiaLightbulb,        path: "/create",    badge: null },
  { label: "Publish",   icon: CiCalendarDate,       path: "/schedule",  badge: "0 posts" },
  { label: "Community", icon: IoChatbubblesOutline, path: "/dashboard", badge: "3" },
  { label: "Analytics", icon: MdAnalytics,          path: "/analytics", badge: null },
]

const Sidebar = () => {
  const navigate  = useNavigate()
  const location  = useLocation()
  const [open, setOpen] = useState(true)   // collapse toggle like Buffer
  const [openmenu, setOpenMenu] = useState(false)

  return (
    <aside className={`h-screen sticky top-0 flex flex-col  border-r border-gray-100 transition-all duration-200 ${open ? 'w-56' : 'w-14'}`}>
<div className='flex flex-col'>
     <div className="flex items-center justify-between px-3 py-3 border-b border-gray-100">
  <Link to="/" className="mr-auto text-xl font-bold tracking-tight text-gray-900 shrink-0">
      <span className="text-[40px] font-bold text-blue-600">S</span>
       {open && <span>chedly.</span>}
    </Link>


  
</div>

<button
  onClick={() => setOpenMenu(!openmenu)}
  className="flex items-center justify-center gap-2 mx-2 bg-green-500 hover:bg-green-600 text-black text-sm font-medium p-2 md:px-4 md:py-3 rounded-full shadow-md transition-all duration-200"
>
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-4 h-4 flex-shrink-0">
    <path d="M5 12H19M12 5V19" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
  {open && <span>New</span>}  {/* ✅ Only show text when open */}
</button>
</div>
{openmenu && <CreateMenu/>}

      {/* ── Main nav links ── */}
      <nav className="flex flex-col gap-0.5 px-2 py-3">
        {navItems.map((item) => {
          const Icon       = item.icon
          const isActive   = location.pathname === item.path
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 px-2 py-2 rounded-lg text-sm w-full text-left transition-colors ${
                isActive
                  ? 'bg-gray-100 text-gray-900 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {open && (
                <span className="flex-1">{item.label}</span>
              )}
              {open && item.badge && (
                <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          )
        })}
      </nav>

  

{/* ✅ Toggle button — always visible */}
 <div className="px-3 py-3 border-t border-gray-100 flex items-center justify-between">
  <button
    onClick={() => setOpen(!open)}
    className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-medium"
  >
    {open ? < FiArrowLeftCircle size = {25}/>  : <FiArrowRightCircle  size = {25}/>}
  </button>
  </div>
      {/* ── Channels section ──
      {open && (
        <div className="flex-1 overflow-y-auto px-2">
          <div className="flex items-center justify-between px-2 py-2">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Channels</span>
            <button className="text-xs text-gray-400 hover:text-gray-700 px-1">+ Add</button>
          </div>

          {channels.map((ch, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-gray-50 cursor-pointer group"
            >
              <img
                src={ch.avatar}
                alt={ch.name}
                className="w-6 h-6 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 truncate">{ch.name}</p>
                <p className="text-xs text-gray-400">{ch.posts} scheduled</p>
              </div>
              <button className="hidden group-hover:block text-xs text-blue-600 hover:underline">
                + Post
              </button>
            </div>
          ))}
        </div>
      )} */}

      <div className="px-3 py-3 border-t border-gray-100 flex items-center justify-between">
        <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-medium">
          
          SC
        </div> 
        {open && <span>shaan Chaudhary</span>}      
      </div> 
    </aside>
  )
}

export default Sidebar