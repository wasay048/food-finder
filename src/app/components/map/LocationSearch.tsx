import React, { useState, useEffect, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import { InputText } from "primereact/inputtext";
import { ListBox } from "primereact/listbox";
import { debounce } from "lodash-es";
import { LoadScript, Libraries } from "@react-google-maps/api";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;
const libraries = ["places"] as Libraries;

interface LocationSearchProps {
  onLocationSelect: (location: {
    lat: number;
    lng: number;
    name: string;
  }) => void;
  handleFlyToLocation: () => void;
  placeName: string;
}

const LocationSearch: React.FC<LocationSearchProps> = ({
  onLocationSelect,
  handleFlyToLocation,
  placeName,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const fetchLocationSuggestions = useCallback(
    debounce(async (query: string) => {
      if (!query) return;

      const service = new google.maps.places.AutocompleteService();
      service.getPlacePredictions(
        { input: query, types: ["address"] },
        (predictions, status) => {
          setSuggestions(predictions as []);
        }
      );
    }, 500),
    []
  );

  useEffect(() => {
    setSearchTerm(placeName);
  }, [placeName]);

  useEffect(() => {
    if (searchTerm.length > 2) {
      fetchLocationSuggestions(searchTerm);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm, fetchLocationSuggestions]);

  const handleSelect = (selectedOption: any) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode(
      { placeId: selectedOption.place_id },
      (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
          const location = results[0].geometry.location;
          onLocationSelect({
            lat: location.lat(),
            lng: location.lng(),
            name: results[0].formatted_address,
          });
          setSearchTerm(results[0].formatted_address);
          setSuggestions([]);
        }
      }
    );
  };

  const listBoxOptions = suggestions?.map((suggestion: any) => ({
    label: suggestion.description,
    value: suggestion,
  }));

  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string}
      libraries={libraries}
    >
      <div className="location-search md:w-3/4">
        <div className="flex items-center bg-white px-4 py-2 rounded flex-grow w-full h-[50px]">
          <i className="pi pi-map-marker text-black mr-2"></i>
          <InputText
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter Delivery Address"
            className="border-none !outline-none flex-grow shadow-none text-black"
          />
          <div className="flex items-center ml-4">
            <button onClick={handleFlyToLocation}>
              <i className="pi pi-compass text-black mr-2"></i>
              <span className="text-black hidden md:block">Share Location</span>
            </button>
          </div>
        </div>

        {suggestions?.length > 0 && (
          <ListBox
            value={searchTerm}
            options={listBoxOptions}
            onChange={(e) => handleSelect(e.value)}
            optionLabel="label"
            listStyle={{
              maxHeight: "250px",
              position: "absolute",
              background: "#fff",
              zIndex: 100,
            }}
          />
        )}
      </div>
    </LoadScript>
  );
};

export default LocationSearch;
