import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Createideas from '../Modals/CreateModal/Createideas';
import CreateIdeaModal from '../Modals/CreateModal/CreateIdeaModal';


const Create = () => {
    const [activeTab, setActiveTab] = useState('Idea');
    const [openModal, setOpenModal] = useState(false);

    const navigate = useNavigate();

const ideasData = [
  {
    id: 1,
    title: "A Roblox cheat and AI tool...",
    description: "Some description here...",
    image: "https://placehold.co/300"
  },
  {
    id: 2,
    title: "Another Idea",
    description: "More text..."
  }
];
    
const columns = [
  {
    title: "Unassigned",
    ideas: ideasData
  },
  {
    title: "to do",
    ideas: [
      { id: 3, title: "Working Idea", description: "Testing..." }
    ]
  },
  {
    title: "Completed",
    ideas: []
  }
];
  const feeds = [{label: 'Idea' }, {label:"template"},{label:'feeds'}]
    return (
      <div className= "h-screen w-auto flex flex-col bg-white"> {/* Outer container for full viewport */}
        {/* Header Section */}
        <header className="bg-white p-4 space-y-4">
          {/* Row 1: Title and Primary Actions */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {/* <AllChannelsIcon className="w-6 h-6 text-gray-500" /> */}
              <h1 className="text-3xl font-semibold">Create</h1>
            </div>
          </div>

          <CreateIdeaModal
  isOpen={openModal}
  onClose={() => setOpenModal(false)}
  onSave={(data) => {
    console.log("New Idea:", data);
    // 🔥 call backend API here
  }}
/>
  
          {/* Row 2: Tabs and Filters */}
          <div className="flex justify-between items-center border-b px-3 py-3.5 border-gray-200">
            <div className="flex space-x-6">
              {feeds.map((tab) => (
                <button
                  key={tab.label}
                 onClick={() => {
                      setActiveTab(tab.label);
                      navigate(tab.path);
                    }}
                  className={`pb-2 px-1 text-m font-medium ${
                    activeTab === tab.label
                      ? 'border-b-2 border-green-500 text-black'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                   {tab.label}
                  {/* {tab.charAt(0).toUpperCase() + tab.slice(1)}  */}
                </button>
              ))}
            </div>
            
          </div>
        </header>

       
              {/* <button className="flex items-center gap-1 text-gray-600">Filter by Channels</button>
              <button className="flex items-center gap-1 text-gray-600">Filter by Tags</button>
              <button className="flex items-center gap-1 text-gray-600">Timezone Kolkata</button> */}
              {/* <div  className= "flex justify-end px-6">
              <button className="bg-green-500 w-25 h-12 px-4 py-2 text-black px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2">New Idea</button>
           </div> */}
       <div className='flex flex-col'>

  {/* ✅ Show button only for Idea tab */}
  {activeTab === 'Idea' && (
    <div className="flex justify-end px-6">
      <button onClick={() => setOpenModal(true)}
       className="bg-green-500 h-12 px-4 text-black rounded-md text-sm font-medium">
        New Idea
      </button>
    </div>
  )}

  {/* Feed Section */}
  <div className="py-5 px-10 flex gap-6 overflow-x-auto">
    {activeTab === 'Idea' && 
    
      columns.map((col, index) => (
        <Createideas
          key={index}
          title={col.title}
          ideas={col.ideas}
          onAdd={() => console.log(`Add in ${col.title}`)}
          onNewIdea={() => console.log(`New Idea in ${col.title}`)}
        />
      ))
    }
  </div>

</div>
  
        {/* Main Content Area */}
     
      </div>
    );
  };

export default Create
