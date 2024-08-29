import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { useState } from "react";

export const SidePanel = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [location, setLocation] = useState<string | null>("Berlin, Germany");
  const locations = [
    { label: "Berlin, Germany", value: "Berlin, Germany" },
    { label: "New York, USA", value: "New York, USA" },
  ];
  return (
    <div
      className={`z-50 fixed top-0 right-0 w-full h-full bg-white shadow-lg transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300 ease-in-out`}
    >
      <button className="p-4 text-black" onClick={onClose}>
        <i className="pi pi-arrow-right text-black mr-2"></i>
      </button>
      <div className="p-4 ">
        <div className="wrap">
          <Dropdown
            value={location}
            options={locations}
            onChange={(e) => setLocation(e.value)}
            placeholder="Select a Location"
            className="w-64 outline-none !border-white shadow-none"
          />
        </div>
        <div className="wrap">
          <Button
            label="Login"
            outlined
            className="w-28 border-black text-black border-[1px] p-3 rounded-full shadow-black mt-4"
          />
        </div>
        <div className="wrap">
          <Button
            label="Sign Up"
            className="w-28 bg-successColor  border-successColor outline-successColor text-black border-[1px] p-3 rounded-full mt-4"
          />
        </div>
      </div>
    </div>
  );
};
