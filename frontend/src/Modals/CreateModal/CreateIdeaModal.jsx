import React, { useState, useRef, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";

const CreateIdeaModal = ({ isOpen, onClose, onSave, columns = [] }) => {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("Unassigned");
  const [description, setDescription] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [activeField, setActiveField] = useState("description");
  const [mediaFiles, setMediaFiles] = useState([]);

  const emojiPickerRef = useRef(null);
  const emojiButtonRef = useRef(null);
  const fileInputRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);

  // Close emoji picker on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(e.target) &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(e.target)
      ) {
        setShowEmoji(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset all state on open
  useEffect(() => {
    if (isOpen) {
      setTitle("");
      setDescription("");
      setStatus("Unassigned");
      setShowEmoji(false);
      setMediaFiles([]);
      setActiveField("description");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleEmojiClick = (emojiData) => {
    const emoji = emojiData.emoji;
    if (activeField === "title") {
      setTitle((prev) => prev + emoji);
      // keep cursor at end
      setTimeout(() => {
        if (titleRef.current) {
          titleRef.current.focus();
          const len = titleRef.current.value.length;
          titleRef.current.setSelectionRange(len, len);
        }
      }, 0);
    } else {
      setDescription((prev) => prev + emoji);
      setTimeout(() => {
        if (descRef.current) {
          descRef.current.focus();
          const len = descRef.current.value.length;
          descRef.current.setSelectionRange(len, len);
        }
      }, 0);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type.startsWith("video") ? "video" : "image",
    }));
    setMediaFiles((prev) => [...prev, ...previews].slice(0, 10));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const previews = files.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type.startsWith("video") ? "video" : "image",
    }));
    setMediaFiles((prev) => [...prev, ...previews].slice(0, 10));
  };

  const removeMedia = (index) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSave({ title, status, description, media: mediaFiles });
    onClose();
  };

  // Build status options from columns prop or fallback
  const statusOptions =
    columns.length > 0
      ? columns.map((c) => c.title)
      : ["Unassigned", "To Do", "Completed"];

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full max-w-[600px] rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-800">New Idea</h2>

          <div className="flex items-center gap-2">
            {/* Status select */}
            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="appearance-none text-xs bg-gray-100 hover:bg-gray-200 transition px-3 py-1.5 pr-7 rounded-lg outline-none cursor-pointer text-gray-700"
              >
                {statusOptions.map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] pointer-events-none">
                ▼
              </span>
            </div>

            {/* Close */}
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition text-lg"
            >
              ✕
            </button>
          </div>
        </div>

        {/* ── Body (scrollable) ── */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">

          {/* Title */}
          <input
            ref={titleRef}
            type="text"
            value={title}
            onFocus={() => setActiveField("title")}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your idea a title..."
            className="w-full text-xl font-semibold placeholder-gray-300 outline-none bg-transparent text-gray-800"
            onKeyDown={(e) => e.key === "Enter" && descRef.current?.focus()}
          />

          {/* Description */}
          <textarea
            ref={descRef}
            value={description}
            onFocus={() => setActiveField("description")}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add more details (optional)..."
            className="w-full text-sm placeholder-gray-300 outline-none bg-transparent resize-none text-gray-600 leading-relaxed min-h-[80px]"
          />

          {/* Media previews */}
          {mediaFiles.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {mediaFiles.map((file, i) => (
                <div key={i} className="relative group rounded-lg overflow-hidden border border-gray-100 aspect-video bg-gray-50">
                  {file.type === "video" ? (
                    <video src={file.url} className="w-full h-full object-cover" />
                  ) : (
                    <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                  )}
                  <button
                    onClick={() => removeMedia(i)}
                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Drop zone */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            className="border border-dashed border-gray-200 rounded-xl p-5 text-center hover:bg-gray-50 cursor-pointer transition group"
          >
            <p className="text-xs text-gray-400 group-hover:text-gray-500">
              📎 Drop up to 10 images or videos, or{" "}
              <span className="underline">browse</span>
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between relative">

          {/* Emoji button */}
          <div className="relative">
            <button
              ref={emojiButtonRef}
              onClick={() => setShowEmoji((v) => !v)}
              className="text-xl hover:scale-110 transition select-none"
              title="Add emoji"
            >
              😊
            </button>

            {/* Emoji picker — always opens upward */}
            {showEmoji && (
              <div
                ref={emojiPickerRef}
                className="absolute bottom-10 left-0 z-50 shadow-xl rounded-xl overflow-hidden"
              >
                <EmojiPicker
                  onEmojiClick={handleEmojiClick}
                  skinTonesDisabled
                  searchDisabled={false}
                  height={350}
                  width={300}
                />
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-lg transition"
            >
              Cancel
            </button>

            <button
              onClick={() => {
                // Navigate to post creation — pass data up first
                if (title.trim()) onSave({ title, status, description, media: mediaFiles });
                onClose();
                // You can navigate here: navigate('/publish')
              }}
              className="px-4 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
            >
              Create Post
            </button>

            <button
              onClick={handleSubmit}
              disabled={!title.trim()}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                title.trim()
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-gray-100 text-gray-300 cursor-not-allowed"
              }`}
            >
              Save Idea
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CreateIdeaModal;