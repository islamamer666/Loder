import React from 'react';
import { Link } from 'react-router-dom';

const Logo = ({ showText = true, className = "", textColor = "text-safety-yellow" }) => {
  return (
    <Link to="/" className={`flex items-center space-x-2 ${className}`}>
      {/* Logo Box with L */}
      <div className="bg-safety-yellow w-10 h-10 flex items-center justify-center rounded">
        <span className="text-charcoal-grey text-2xl font-bold">L</span>
      </div>
      {/* LODER Text */}
      {showText && (
        <span className={`text-2xl font-black ${textColor}`}>LODER</span>
      )}
    </Link>
  );
};

export default Logo;

