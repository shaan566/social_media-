import React from "react";
import { WiDirectionLeft } from "react-icons/wi"; 


const ComingSoon = () => {
  return (
    <div className="min-h-screen flex items-center justify-center text-center px-4">
      <div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-black">
          🚧 Coming Soon
        </h1>
        <p className="text-gray-600 text-lg">
          This page is under construction
        </p>
       
            <a href="/" 
            className="mt-6 inline-flex items-center gap-2  bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
               <WiDirectionLeft  size = {25}/>
              Back to Home
             
            </a>
   

      </div>
    </div>
  );
};


export default ComingSoon;
