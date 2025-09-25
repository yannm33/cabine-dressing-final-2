/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from "react";
import Spinner from "./Spinner";

interface CustomImageSliderProps {
  leftImage: string;
  rightImage: string;
  className?: string;
  isLoading?: boolean;
  loadingMessage?: string;
}

const CustomImageSlider: React.FC<CustomImageSliderProps> = ({ leftImage, rightImage, className, isLoading, loadingMessage }) => {
  const [position, setPosition] = useState(50); // % de révélation

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPosition(Number(e.target.value));
  };
  
  if (isLoading) {
      return (
          <div className={`relative overflow-hidden ${className} flex flex-col items-center justify-center bg-gray-100 border`}>
              <Spinner />
              {loadingMessage && (
                  <p className="text-md font-serif text-gray-600 mt-4 text-center px-4">{loadingMessage}...</p>
              )}
          </div>
      );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Image gauche */}
      <img
        src={leftImage}
        alt="Image avant transformation"
        className="absolute top-0 left-0 w-full h-full object-cover"
      />

      {/* Image droite révélée */}
      <div
        className="absolute top-0 left-0 h-full overflow-hidden"
        style={{ width: `${position}%` }}
      >
        <img src={rightImage} alt="Image après transformation" className="absolute top-0 left-0 w-full h-full object-cover" style={{ width: '100%', height: '100%' }} />
      </div>

      {/* Input invisible qui gère le glissement */}
      <input
        type="range"
        min="0"
        max="100"
        value={position}
        onChange={handleChange}
        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-col-resize z-30"
        aria-label="Comparer les images"
      />

      {/* Barre verticale */}
      <div
        className="absolute top-0 h-full bg-white/80 backdrop-blur-sm pointer-events-none z-20"
        style={{
          left: `${position}%`,
          width: "4px",
          transform: "translateX(-50%)",
          boxShadow: "0 0 8px rgba(0,0,0,0.5)"
        }}
      />

      {/* Poignée centrale */}
      <div
        className="absolute flex items-center justify-center pointer-events-none z-20"
        style={{
          top: "50%",
          left: `${position}%`,
          transform: "translate(-50%, -50%)",
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.8)",
          boxShadow: "0 0 8px rgba(0,0,0,0.5)",
          backdropFilter: "blur(4px)"
        }}
      >
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-gray-800">
            <polyline points="15 18 9 12 15 6"></polyline>
            <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </div>
    </div>
  );
};

export default CustomImageSlider;