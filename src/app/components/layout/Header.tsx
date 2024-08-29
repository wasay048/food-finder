"use client";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { useState } from "react";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "tailwindcss/tailwind.css";
import Image from "next/image";
import { SidePanel } from "./Sidepanel";

const Header = () => {
  const [location, setLocation] = useState<string | null>("Berlin, Germany");
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const toggleMenu = () => {
    setIsPanelOpen(!isPanelOpen);
  };
  const locations = [
    { label: "Berlin, Germany", value: "Berlin, Germany" },
    { label: "New York, USA", value: "New York, USA" },
  ];

  return (
    <>
      <div className="bg-white shadow-md py-4 px-6 md:px-8 flex justify-between items-center">
        <div className="flex items-center">
          <Image
            src="/Logo.png"
            alt="Logo"
            className="h-8 mr-4"
            width="120"
            height="100"
          />
        </div>
        <div className="md:hidden">
          <Button
            icon="pi pi-bars"
            className="p-button-text"
            onClick={toggleMenu}
          />
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <Dropdown
            value={location}
            options={locations}
            onChange={(e) => setLocation(e.value)}
            placeholder="Select a Location"
            className="w-full md:w-56 outline-none !border-white shadow-none"
          />

          <Button
            label="Login"
            outlined
            className="w-full md:w-auto border-black text-black border-[1px] p-3 rounded-full px-10 shadow-black"
          />
          <Button
            label="Sign Up"
            className="bg-successColor w-full md:w-auto border-successColor outline-successColor text-black border-[1px] p-3 rounded-full px-10"
          />
        </div>
      </div>
      <SidePanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} />
    </>
  );
};

export default Header;
