import React from "react";
import { MdNotificationsNone, MdSearch } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import AppLogo from "../../assets/AppLogo.png";

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-40">
      
      {/* Left: Logo + Name */}
      <div className="flex items-center space-x-3">
        <img
          src={AppLogo}
          alt="Hospital360 Logo"
          className="h-16 w-16"
        />
        <h1 className="text-xl font-semibold text-[#0f4c81] tracking-tight">
          Hospital360
        </h1>
      </div>

      {/* Center: Search */}
      <div className="flex-1 max-w-md mx-6 relative">
        <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search patients, staff, or reports..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0fb5a3] focus:border-[#0fb5a3] outline-none"
        />
      </div>

      {/* Right: Notifications + Profile */}
      <div className="flex items-center space-x-5">
        {/* Notification button */}
        <button className="text-gray-600 hover:text-[#0f4c81] p-2 rounded-full hover:bg-gray-100 transition">
          <MdNotificationsNone className="h-6 w-6" />
        </button>

        {/* User avatar */}
        <div className="h-9 w-9 text-gray-600">
          <FaUserCircle className="h-9 w-9" />
        </div>
      </div>
    </header>
  );
};

export default Header;
