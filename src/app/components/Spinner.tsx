import React from "react";
import { ProgressSpinner } from "primereact/progressspinner";

const Spinner = () => {
  return (
    <div className="left-1/2 top-1/2 h-screen absolute z-50 ">
      <ProgressSpinner
        style={{ width: "80px", height: "80px", color: "blue" }}
        strokeWidth="4"
        fill="#5ac12f"
      />
    </div>
  );
};

export default Spinner;
