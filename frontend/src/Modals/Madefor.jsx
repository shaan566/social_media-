import React from "react";

const madefor = [
  { title: "Creators",          description: "Grow your community with confidence, not complexity"       },
  { title: "Small Business",    description: "A simpler way to manage your small business' social media" },
  { title: "Agencies",          description: "Run every client's social with clarity"                    },
  { title: "Nonprofits",        description: "Made for small teams doing big things"                     },
  { title: "Higher Education",  description: "Social media management built for schools and universities" },
];

const Madefor = () => (
  <div className="w-[min(90vw,340px)] rounded-2xl border border-gray-200 bg-white p-3 shadow-xl">
    <ul className="flex flex-col gap-0.5">
      {madefor.map((item) => (
        <li key={item.title}>
          <div className="cursor-pointer rounded-xl p-3 transition hover:bg-gray-50">
            <p className="text-sm font-semibold text-gray-900 leading-tight">
              {item.title}
            </p>
            <p className="mt-0.5 text-xs text-gray-500 leading-snug">
              {item.description}
            </p>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export default Madefor;