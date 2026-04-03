import React from "react";

const madefor = [
  {
    title: "Creators",
    description: "Grow your community with confidence, not complexity",
  },
  {
    title: "Small Business",
    description: "A simpler way to manage your small business’ social media",
  },
  {
    title: "Agencies",
    description: "Run every client’s social with clarity",
  },
  {
    title: "Nonprofits",
    description: "Made for small teams doing big things",
  },
  {
    title: "Higher Education",
    description: "Social media management built for schools and universities",
  },
];

function Madefor() {
  return (
    <div className="bg-white rounded-2xl shadow-xl border p-4 w-[500px]">

      <ul className="flex flex-col gap-1">

        {madefor.map((item) => (
          <li key={item.title}>
            <div className="flex flex-col p-3 rounded-xl hover:bg-gray-50 hover:shadow-sm transition cursor-pointer">

              <span className="text-sm font-semibold text-gray-900">
                {item.title}
              </span>

              <span className="text-xs text-gray-500 mt-1 leading-relaxed">
                {item.description}
              </span>

            </div>
          </li>
        ))}

      </ul>

    </div>
  );
}

export default Madefor;