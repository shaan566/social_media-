import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Createideas from '../Modals/CreateModal/Createideas';
import CreateIdeaModal from '../Modals/CreateModal/CreateIdeaModal';

const Create = () => {
  const [activeTab, setActiveTab] = useState('Idea');
  const [openModal, setOpenModal] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const navigate = useNavigate();

  const [columns, setColumns] = useState([
    {
      title: "Unassigned",
      ideas: [
        {
          id: 1,
          title: "A Roblox cheat and AI tool brought down Vercel",
          description: "webmatrices.com/post/how-a-roblox-cheat...",
        },
        {
          id: 2,
          title: "Automatic Programming",
          description: "antirez.com/news/159"
        }
      ]
    },
    {
      title: "To Do",
      ideas: [
        { id: 3, title: "Working Idea", description: "Testing..." }
      ]
    },
    {
      title: "Completed",
      ideas: []
    }
  ]);

  const feeds = [{ label: 'Idea' }, { label: "template" }, { label: 'feeds' }];

  const handleAddGroup = () => {
    if (!newGroupName.trim()) return;
    setColumns(prev => [...prev, { title: newGroupName, ideas: [] }]);
    setNewGroupName("");
    setShowInput(false);
  };

  // ✅ THIS is the key fix — add idea to the matching column
  const handleSaveIdea = (data) => {
    const newIdea = {
      id: Date.now(),
      title: data.title,
      description: data.description,
      media: data.media || [],
    };

    setColumns(prev =>
      prev.map(col =>
        col.title === data.status   // match column by status name
          ? { ...col, ideas: [newIdea, ...col.ideas] }
          : col
      )
    );
  };

  return (
    <div className="h-screen w-auto flex flex-col bg-white">

      {/* Header */}
      <header className="bg-white p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold">Create</h1>
        </div>

        {/* ✅ Pass columns here so modal shows correct status options */}
        <CreateIdeaModal
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          columns={columns}          
          onSave={handleSaveIdea}    
        />

        {/* Tabs */}
        <div className="flex justify-between items-center border-b px-3 py-3.5 border-gray-200">
          <div className="flex space-x-6">
            {feeds.map((tab) => (
              <button
                key={tab.label}
                onClick={() => {
                  setActiveTab(tab.label);
                  if (tab.path) navigate(tab.path);
                }}
                className={`pb-2 min-w-[80px] px-1 text-m font-medium ${
                  activeTab === tab.label
                    ? 'border-b-2 border-green-500 text-black'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="flex flex-col">

        {/* New Idea button */}
        {activeTab === 'Idea' && (
          <div className="flex justify-end px-6 py-2">
            <button
              onClick={() => setOpenModal(true)}
              className="bg-green-500 h-10 px-4 text-white rounded-md text-sm font-medium"
            >
              + New Idea
            </button>
          </div>
        )}

        {/* Board */}
        <div className="py-5 px-10 flex gap-6 overflow-x-auto">

          {activeTab === 'Idea' && columns.map((col, index) => (
            <Createideas
              key={index}
              title={col.title}
              ideas={col.ideas}
              onRename={(newTitle) => {
                const updated = [...columns];
                updated[index].title = newTitle;
                setColumns(updated);
              }}
              onAddIdea={() => setOpenModal(true)}  // optional: open modal from column
            />
          ))}

          {/* New Group */}
          {activeTab === 'Idea' && (
            showInput ? (
              <input
                type="text"
                value={newGroupName}
                autoFocus
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Enter group name"
                className="min-w-[200px] h-[50px] border border-gray-300 focus:border-blue-500 rounded-md px-3 py-2 outline-none"
                onKeyDown={(e) => e.key === "Enter" && handleAddGroup()}
                onBlur={() => {
                  if (newGroupName.trim()) handleAddGroup();
                  else setShowInput(false);
                }}
              />
            ) : (
              <button
                onClick={() => setShowInput(true)}
                className="min-w-[200px] h-[50px] rounded-md   border-gray-300 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-400 transition"
              >
                + New Group
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Create;