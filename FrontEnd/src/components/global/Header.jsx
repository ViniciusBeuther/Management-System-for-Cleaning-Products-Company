import React from "react";
import logo from '../../assets/aionix-solutions-high-resolution-logo-grayscale-transparent-512-black.png'

const HeaderComponent = () => {
  return (
    <header className="flex items-center justify-center">
      <img src={logo} alt="company-logo" />
    </header>
  );
};

export default HeaderComponent;
