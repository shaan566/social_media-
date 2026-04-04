import React from "react";

const resourcesData = [
  { title: "Blog",                  description: "Real-life stories and resources on growing an engaged audience"        },
  { title: "Templates",             description: "Plug-and-play content templates to jump-start your planning"          },
  { title: "Free Tools",            description: "Easy-to-use tools to grow your presence across social media"          },
  { title: "Social Media Insights", description: "Data-driven benchmarks, trends, and tips to grow smarter on social"   },
  { title: "Our Community",         description: "Learn, connect, and grow with creators around the world"              },
  { title: "Support",               description: "Help articles and tutorials to get the most out of Schedly"           },
];

const Resources = () => (
  <div className="w-[min(90vw,520px)] rounded-2xl border border-gray-200 bg-white p-4 shadow-xl">

    <p className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-400 px-1">
      Resources
    </p>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
      {resourcesData.map((item) => (
        <div
          key={item.title}
          className="cursor-pointer rounded-xl p-3 transition hover:bg-gray-50 hover:-translate-y-px"
        >
          <p className="text-sm font-semibold text-gray-900 leading-tight">
            {item.title}
          </p>
          <p className="mt-0.5 text-xs text-gray-500 leading-snug">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  </div>
);

export default Resources;