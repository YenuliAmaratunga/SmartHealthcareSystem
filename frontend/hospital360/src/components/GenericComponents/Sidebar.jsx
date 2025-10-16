import React, { useState } from "react"; 
import { NavLink } from "react-router-dom";
import {
  MdSpaceDashboard,
  MdOutlinePeople,
  MdOutlineCalendarToday,
  MdOutlineMedicalServices,
  MdAssessment,
  MdMenu,
} from "react-icons/md";

const Sidebar = ({ isCollapsed, toggleCollapse }) => {
  const navItems = [
    { name: "Dashboard", icon: <MdSpaceDashboard />, path: "/dashboard" },
    { name: "Patients", icon: <MdOutlinePeople />, path: "/patients" },
    { name: "Appointments", icon: <MdOutlineCalendarToday />, path: "/appointments" },
    { name: "Staff", icon: <MdOutlineMedicalServices />, path: "/staff" },
    { name: "Reports", icon: <MdAssessment />, path: "/reports" },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-[#0f4c81] text-white flex flex-col shadow-lg z-30
      transition-width duration-300 ${isCollapsed ? "w-16" : "w-52"}`}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-[#0fb5a3]/30">
        {!isCollapsed && (
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Hospital360
          </h1>
        )}
        <button
          onClick={toggleCollapse}
          className="text-white text-xl p-1 hover:bg-[#0fb5a3]/30 rounded"
        >
          <MdMenu />
        </button>
      </div>

      <nav className="flex-1 mt-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? "bg-[#0fb5a3] text-white shadow-inner"
                  : "text-gray-200 hover:bg-[#0fb5a3]/20 hover:text-white"
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            {!isCollapsed && <span className="ml-3">{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      {!isCollapsed && (
        <div className="text-xs text-gray-300 p-4 border-t border-[#0fb5a3]/30">
          © 2025 Hospital360
        </div>
      )}
    </aside>
  );
};


export default Sidebar;
