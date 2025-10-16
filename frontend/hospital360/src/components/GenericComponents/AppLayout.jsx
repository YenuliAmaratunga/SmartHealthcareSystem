import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const AppLayout = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main content area */}
      <div
        className={`flex-1 flex flex-col transition-margin duration-300`}
        style={{
          marginLeft: isSidebarCollapsed ? "4rem" : "13rem", // match sidebar width
        }}
      >
        {/* Header */}
        <Header />

        {/* Page content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children ? (
            children
          ) : (
            <div className="space-y-6">
              {/* Example System Overview / Dashboard cards */}
              <h1 className="text-2xl font-semibold text-gray-800">
                System Overview
              </h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Sample dashboard card */}
                <div className="bg-white shadow-md rounded-lg p-4 border-l-4 border-[#0fb5a3]">
                  <h2 className="text-gray-500 text-sm">Patients</h2>
                  <p className="text-xl font-bold text-gray-800">1,234</p>
                </div>

                <div className="bg-white shadow-md rounded-lg p-4 border-l-4 border-[#0f4c81]">
                  <h2 className="text-gray-500 text-sm">Appointments</h2>
                  <p className="text-xl font-bold text-gray-800">456</p>
                </div>

                <div className="bg-white shadow-md rounded-lg p-4 border-l-4 border-[#0fb5a3]">
                  <h2 className="text-gray-500 text-sm">Doctors</h2>
                  <p className="text-xl font-bold text-gray-800">78</p>
                </div>

                <div className="bg-white shadow-md rounded-lg p-4 border-l-4 border-[#0f4c81]">
                  <h2 className="text-gray-500 text-sm">Pending Reports</h2>
                  <p className="text-xl font-bold text-gray-800">12</p>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default AppLayout;
