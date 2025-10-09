import React from "react";
import logo from "../assets/logo-sans-fond.png";

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-4">
        <img src={logo} alt="logo" className="w-25 h-25" />
      </div>
      <div className="text-sm text-gray-400">Gestion d'équipes de football</div>
    </header>
  );
};

export default Header;
