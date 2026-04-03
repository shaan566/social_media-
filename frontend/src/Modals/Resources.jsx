import React from "react";

const resourcesData = [
  {
    title: "Blog",
    description: "Real-life stories and resources on growing an engaged audience",
  },
  {
    title: "Templates",
    description: "Plug-and-play content templates to jump-start your planning",
  },
  {
    title: "Free Tools",
    description: "Easy-to-use tools to grow your presence across social media",
  },
  {
    title: "Social Media Insights",
    description: "Data-driven benchmarks, trends, and tips to grow smarter on social",
  },
  {
    title: "Our Community",
    description: "Learn, connect, and grow with creators around the world",
  },
  {
    title: "Support",
    description: "Help articles and tutorials to get the most out of Schedly",
  },
];

const Resources = () => {
  return (
    <div className="bg-white rounded-2xl shadow-xl border p-4 sm:p-5 w-full max-w-[600px]">

      {/* Title */}
      <p className="text-xs text-gray-500 mb-3 px-1">
        Resources
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">

        {resourcesData.map((item) => (
          <div
            key={item.title}
            className="p-3 rounded-xl hover:bg-gray-50 hover:shadow-sm hover:-translate-y-[2px] transition-all duration-200 cursor-pointer"
          >
            {/* Title */}
            <p className="text-sm font-semibold text-gray-900">
              {item.title}
            </p>

            {/* Description */}
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}

      </div>
    </div>
  );
};

export default Resources;