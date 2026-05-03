import React, { useState } from 'react';

const Createideas = ({ title, ideas, onRename, onAddIdea, onDeleteIdea }) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [colName, setColName] = useState(title);
  const [openMenuId, setOpenMenuId] = useState(null);

  // keep local name in sync if parent changes title
  React.useEffect(() => {
    setColName(title);
  }, [title]);

  const handleRenameSubmit = () => {
    if (colName.trim()) onRename?.(colName.trim());
    setIsRenaming(false);
  };

  return (
    <div className="min-w-[260px] max-w-[260px] bg-gray-50 border border-gray-200 rounded-xl flex flex-col max-h-[80vh]">

      {/* ── Column Header ── */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-2">

          {/* Editable title */}
          {isRenaming ? (
            <input
              autoFocus
              value={colName}
              onChange={(e) => setColName(e.target.value)}
              onBlur={handleRenameSubmit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRenameSubmit();
                if (e.key === 'Escape') {
                  setColName(title);
                  setIsRenaming(false);
                }
              }}
              className="text-sm font-medium border border-blue-300 rounded px-1.5 py-0.5 outline-none w-28 bg-white"
            />
          ) : (
            <h3
              className="text-sm font-medium text-gray-800 cursor-pointer hover:text-blue-600 transition"
              onClick={() => setIsRenaming(true)}
              title="Click to rename"
            >
              {colName}
            </h3>
          )}

          {/* Badge count */}
          <span className="text-xs bg-white border border-gray-200 rounded-full px-2 py-0.5 text-gray-500 font-medium">
            {ideas.length}
          </span>
        </div>

        {/* + Add button */}
        <button
          onClick={() => onAddIdea?.(title)}
          className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-gray-200 text-gray-500 hover:text-gray-700 text-xl transition"
          title="Add idea to this column"
        >
          +
        </button>
      </div>

      {/* ── Cards List (scrollable) ── */}
      <div className="flex flex-col gap-2 p-2 overflow-y-auto flex-1">

        {ideas.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-gray-300 text-xs gap-1">
            <span className="text-2xl">💡</span>
            No ideas yet
          </div>
        )}

        {ideas.map((idea) => (
          <div
            key={idea.id}
            className="bg-white border border-gray-100 rounded-lg p-3 relative group hover:border-gray-300 hover:shadow-sm transition cursor-pointer"
          >

            {/* Media preview — image */}
            {idea.image && (
              <img
                src={idea.image}
                alt=""
                className="w-full h-28 object-cover rounded-md mb-2"
                onError={(e) => (e.target.style.display = 'none')}
              />
            )}

            {/* Media preview — uploaded files from modal */}
            {idea.media && idea.media.length > 0 && !idea.image && (
              <div className="grid grid-cols-2 gap-1 mb-2">
                {idea.media.slice(0, 4).map((file, i) => (
                  <div key={i} className="relative rounded-md overflow-hidden bg-gray-50 aspect-video">
                    {file.type === 'video' ? (
                      <video src={file.url} className="w-full h-full object-cover" />
                    ) : (
                      <img src={file.url} alt="" className="w-full h-full object-cover" />
                    )}
                    {/* show +N if more than 4 */}
                    {i === 3 && idea.media.length > 4 && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-medium">
                        +{idea.media.length - 4}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Title */}
            {idea.title && (
              <h4 className="text-xs font-semibold text-gray-800 mb-1 leading-snug line-clamp-2">
                {idea.title}
              </h4>
            )}

            {/* Description */}
            {idea.description && (
              <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                {idea.description}
              </p>
            )}

            {/* 3-dot menu button — visible on hover */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenMenuId(openMenuId === idea.id ? null : idea.id);
              }}
              className="absolute top-2 right-2 w-6 h-6 rounded border border-gray-200 bg-white text-gray-400 hover:text-gray-600 text-sm items-center justify-center hidden group-hover:flex transition"
            >
              ···
            </button>

            {/* Dropdown menu */}
            {openMenuId === idea.id && (
              <>
                {/* invisible backdrop to close on outside click */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setOpenMenuId(null)}
                />
                <div className="absolute top-8 right-2 z-20 bg-white border border-gray-100 rounded-lg shadow-md text-xs w-32 overflow-hidden">
                  <button
                    className="block w-full text-left px-3 py-2 hover:bg-gray-50 text-gray-700"
                    onClick={() => { setOpenMenuId(null); onAddIdea?.(title); }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="block w-full text-left px-3 py-2 hover:bg-gray-50 text-gray-700"
                    onClick={() => setOpenMenuId(null)}
                  >
                    📋 Move to...
                  </button>
                  <button
                    className="block w-full text-left px-3 py-2 hover:bg-red-50 text-red-500"
                    onClick={() => {
                      setOpenMenuId(null);
                      onDeleteIdea?.(idea.id);
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* ── Bottom New Idea button ── */}
      <div className="px-2 pb-2 pt-1 shrink-0">
        <button
          onClick={() => onAddIdea?.(title)}
          className="w-full py-2 text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition flex items-center justify-center gap-1"
        >
          + New Idea
        </button>
      </div>
    </div>
  );
};

export default Createideas;