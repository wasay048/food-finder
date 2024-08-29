import React from "react";

interface CardProps {
  imageSrc: string;
  altText: string;
  deliveryTime: string;
  title: string;
  description: string;
  rating: string;
  minimumOrder: string;
}

const Card: React.FC<CardProps> = ({
  imageSrc,
  altText,
  deliveryTime,
  title,
  description,
  rating,
  minimumOrder,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img
        src={imageSrc}
        alt={altText}
        className="w-full h-32 sm:h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex justify-between items-center">
          <span className="bg-gray-200 text-fontDark text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
            {deliveryTime}
          </span>
          <button className="text-red-500 hover:text-red-700">
            <i className="pi pi-heart"></i>{" "}
          </button>
        </div>
        <h3 className="text-lg font-semibold mt-2">{title}</h3>
        <p className="text-fontGrey text-sm mt-1">{description}</p>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-success text-sm">{rating}</span>
          <span className="text-fontGrey text-sm">{minimumOrder}</span>
        </div>
      </div>
    </div>
  );
};

export default Card;
