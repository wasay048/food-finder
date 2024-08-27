"use client";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { useState } from "react";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "tailwindcss/tailwind.css";
import Image from "next/image";

const Header = () => {
  const [location, setLocation] = useState<string | null>(null);
  const locations = [
    { label: "Berlin, Germany", value: "Berlin, Germany" },
    { label: "New York, USA", value: "New York, USA" },
  ];

  return (
    <div className="bg-white shadow-md py-4 px-6 md:px-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0">
        <Image
          src="/Logo.png"
          alt="Logo"
          className="h-8 mr-0 md:mr-4"
          width="100"
          height="100"
        />
      </div>

      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
        <Dropdown
          value={location}
          options={locations}
          onChange={(e) => setLocation(e.value)}
          placeholder="Select a Location"
          className="w-full md:w-56 outline-none !border-white shadow-none"
        />
      </div>

      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
        <Button
          label="Login"
          outlined
          className=" w-full md:w-auto border-black text-black border-[1px] p-3 rounded-full px-10 shadow-black"
        />
        <Button
          label="Sign Up"
          className="bg-successColor w-full md:w-auto border-successColor outline-successColor text-black border-[1px] p-3 rounded-full px-10 "
        />
      </div>
    </div>
  );
};

export default Header;
