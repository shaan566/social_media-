import React from 'react';

const Createideas = ({ title, ideas, onAdd, onNewIdea }) => {
  return (
    <div className="w-80 bg-gray-50 rounded-xl p-4 shadow-sm">

      {/* Header */}
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-800">
            {title}
          </h3>
          <span className="bg-gray-200 text-xs px-2 py-0.5 rounded-full">
            {ideas.length}
          </span>
        </div>

        <button
          onClick={onAdd}
          className="flex items-center gap-1 text-3xl text-blue-600 hover:text-blue-700"
        >
          +
        </button>
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {ideas.map((idea) => (
          <div
            key={idea.id}
            className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition"
          >
            {idea.image && (
              <img src={idea.image} alt="" className="rounded-md mb-2" />
            )}

            <h4 className="text-sm font-semibold text-gray-800">
              {idea.title}
            </h4>

            <p className="text-xs text-gray-500 mt-1">
              {idea.description}
            </p>

            <div className="flex justify-end mt-2">
              <button className="text-xs text-gray-400 hover:text-gray-600">
                ⋯
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Button */}
      <button
        onClick={onNewIdea}
        className="w-full mt-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
      >
        + New Idea
      </button>
    </div>
  );
};

export default Createideas;