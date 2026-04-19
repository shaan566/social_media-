import React from 'react'
import { useState } from 'react';

const Analytics = () => {
 const [activeTab, setActiveTab] = useState('queue');
   const counts = { queue: 0, drafts: 0, approvals: 0, sent: 18 };
 
   return (
     <div className="h-screen flex flex-col rounded-4xl"> {/* Outer container for full viewport */}
       {/* Header Section */}
       <header className="border-b border-gray-200 bg-white p-4 space-y-4">
         {/* Row 1: Title and Primary Actions */}
         <div className="flex justify-between items-center">
           <div className="flex items-center gap-2">
             {/* <AllChannelsIcon className="w-6 h-6 text-gray-500" /> */}
             <h1 className="text-xl font-semibold">All Channels</h1>
           </div>
           <div className="flex items-center gap-4">
             <button className="text-sm text-gray-600 hover:text-gray-900">Share Feedback</button>
             <div className="flex bg-gray-100 rounded-lg p-1">
               <button className="px-3 py-1 rounded-md bg-white shadow-sm">List</button>
               <button className="px-3 py-1 rounded-md">Calendar</button>
             </div>
             <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2">
               {/* <PlusIcon className="w-4 h-4" />  */}
               New Post
             </button>
           </div>
         </div>
 
         {/* Row 2: Tabs and Filters */}
         <div className="flex justify-between items-center border-b border-gray-200">
           <div className="flex space-x-6">
             {['queue', 'drafts', 'approvals', 'sent'].map((tab) => (
               <button
                 key={tab}
                 onClick={() => setActiveTab(tab)}
                 className={`pb-2 px-1 text-sm font-medium ${
                   activeTab === tab
                     ? 'border-b-2 border-blue-600 text-blue-600'
                     : 'text-gray-500 hover:text-gray-700'
                 }`}
               >
                 {tab.charAt(0).toUpperCase() + tab.slice(1)} ({counts[tab]})
               </button>
             ))}
           </div>
           <div className="flex items-center gap-4 text-sm">
             <button className="flex items-center gap-1 text-gray-600">Filter by Channels</button>
             <button className="flex items-center gap-1 text-gray-600">Filter by Tags</button>
             <button className="flex items-center gap-1 text-gray-600">Timezone Kolkata</button>
             <button className="flex items-center gap-1 text-gray-600">More actions</button>
           </div>
         </div>
       </header>
 
       {/* Main Content Area */}
       <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
         {activeTab === 'queue' && (
           <div className="flex flex-col items-center justify-center h-full text-center">
             {/* <EmptyQueueIllustration className="w-80 mb-6" /> */}
             <h2 className="text-lg font-semibold text-gray-900">No posts scheduled</h2>
             <p className="text-gray-500 mt-1">Schedule some posts and they will appear here</p>
             <button className="mt-6 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md shadow-sm flex items-center gap-2">
               {/* <PlusIcon className="w-4 h-4" />  */}
               Create your next post
             </button>
           </div>
         )}
       </main>
     </div>
   );
 };

export default Analytics
