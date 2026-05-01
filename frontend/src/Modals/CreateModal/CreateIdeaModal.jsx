import React, { useState,useRef,useEffect } from "react";
import EmojiPicker from 'emoji-picker-react';

const CreateIdeaModal = ({ isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("Unassigned");
  const [description,setdescription] = useState("")
  const [showEmoji, setShowEmoji] = useState(false);
  const [activeField, setActiveField] = useState(null);
  
  const emojiRef = useRef(null);

  // ✅ Hook must be here (TOP LEVEL)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setShowEmoji(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ✅ AFTER all hooks
  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSave({ title, status, description });
    setdescription("")
    setTitle("");
    onClose();
  };

  // Use icon for Good UI 
   const handleEmojiClick = (emojiData) => {
  if (activeField === "title") {
    setTitle((prev) => prev + emojiData.emoji);
  } else if (activeField === "description") {
    setdescription((prev) => prev + emojiData.emoji);
  }
};

  return (
  <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">

  <div 
  ref={emojiRef} className="flex flex-col items-end gap-2 ">

    {/* ✅ Fixed Close Button */}
    <button
      onClick={onClose}
      className="text-white text-2xl hover:scale-110 transition mr-2"
    >
      ✕
    </button>

    <div className="bg-white w-full max-w-[620px] mx-4 rounded-2xl shadow-xl p-6 transition-all">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-gray-800">
          Create Idea
        </h2>

       <div className="flex items-center gap-3">

  {/* Status Dropdown */}
  <div className="relative">
    <select
      value={status}
      onChange={(e) => setStatus(e.target.value)}
      className="appearance-none text-sm bg-gray-100 hover:bg-gray-200 transition px-4 py-2 pr-8 rounded-lg outline-none cursor-pointer"
    >
      <option>Unassigned</option>
      <option>To Do</option>
      <option>Completed</option>
    </select>

    {/* Custom arrow */}
    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs pointer-events-none">
      ▼
    </span>
  </div>
{/* 
  Tags Button
  <button className="flex items-center gap-1 text-sm bg-gray-100 hover:bg-gray-200 transition px-4 py-2 rounded-lg text-gray-700">
    <span>🏷️</span>
    Tags
  </button> */}
   

</div>
      </div>

      {/* Input */}
      <input
        type="text"
        onFocus={() => setActiveField("title")}
        placeholder="Give your idea a title..."
        className="w-full text-lg font-bold placeholder-gray-400 outline-none border-b border-gray-200  pb-2 mb-4 bg-transparent"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* Helper / Description */}
     <textarea
  value={description}
  onFocus={() => setActiveField("description")}
  onChange={(e) => setdescription(e.target.value)}
  placeholder="Add more details (optional)..."
  className="w-full text-lg placeholder-gray-400 outline-none border-b border-gray-200 min-h-[80px] sm:min-h-[100px] mb-4 bg-transparent resize-none"
/>

      {/* Upload */}
      <div className="border border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 cursor-pointer transition mb-5">
        <div className="text-gray-400 text-sm">
          📎 Drag & drop or <span className="underline">select a file</span>
        </div>
      </div>

      {/* Footer */}
     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2">

       <div 
//  ref={emojiRef} 
 className="flex justify-start">
         <button
         
          onClick={() => setShowEmoji(!showEmoji)}
          className="text-xl px-2 left-0 hover:scale-110 transition"
        >
          😊
        </button>
         {showEmoji && (
       <div className="absolute bottom-14 left-0 w-[90vw] sm:w-auto max-w-[350px] sm:max-w-none">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
</div>
      <div className="flex flex-wrap justify-end gap-2 sm:gap-3 pt-2">
        <button className="bg-gray-100 px-4 py-2 rounded-md text-sm text-gray-600 hover:bg-gray-200">
          Create Post
        </button>

        

        <button
          onClick={handleSubmit}
          disabled={!title.trim()}
          className={`px-4 py-2 rounded-md text-sm font-medium transition ${
            title.trim()
              ? "bg-green-500 hover:bg-green-600 text-black"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Save Idea
        </button>
       
      </div>

    </div>
  </div>
</div>
</div>
  );
};

export default CreateIdeaModal;