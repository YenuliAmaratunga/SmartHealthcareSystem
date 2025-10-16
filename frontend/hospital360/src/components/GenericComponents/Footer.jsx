import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#0f4c81] text-white text-sm py-3 px-6 mt-auto border-t border-[#0fb5a3]/30">
      <div className="flex justify-between items-center">
        <p className="text-gray-200">
          © {new Date().getFullYear()} <span className="font-semibold">Hospital360</span>. All rights reserved.
        </p>
        <p className="text-gray-300">
          Designed & Developed by <span className="text-[#0fb5a3] font-medium">Hospital360 Team</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
