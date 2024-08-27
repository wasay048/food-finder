import React, { useState, useEffect, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import { InputText } from "primereact/inputtext";
import { ListBox } from "primereact/listbox";
import { debounce } from "lodash-es";
import { LoadScript, Autocomplete, Libraries } from "@react-google-maps/api";
import { useCurrentLocation } from "src/app/hoooks/location";
import { useMap } from "react-leaflet";
import L from "leaflet";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;
const libraries = ["places"] as Libraries;

interface LocationSearchProps {
  onLocationSelect: (location: {
    lat: number;
    lng: number;
    name: string;
  }) => void;
  handleFlyToLocation: () => void;
}

const LocationSearch: React.FC<LocationSearchProps> = ({
  onLocationSelect,
  handleFlyToLocation,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [placeName, setPlaceName] = useState("");

  const mapboxAccessToken =
    "pk.eyJ1IjoiYWJkdWx3YXNheSIsImEiOiJja3N0YWp5aHcwbWxhMnZtbGRhZzdudWxmIn0.r9SQfFwkyliVpkHdWViP5A";
  const myLocation = useCurrentLocation();

  useEffect(() => {
    if (myLocation) {
      const { lat, lng } = myLocation;
      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data && data.display_name) {
            setPlaceName(data.display_name);
            onLocationSelect({
              lat: lat,
              lng: lng,
              name: data.display_name,
            });
          }
        })
        .catch((error) => {
          console.error("Error fetching place name:", error);
        });
    }
  }, [myLocation]);

  const fetchLocationSuggestions = useCallback(
    debounce(async (query: string) => {
      if (!query) return;

      const service = new google.maps.places.AutocompleteService();
      service.getPlacePredictions(
        { input: query, types: ["address"] },
        (predictions, status) => {
          console.log("🚀 ~ debounce ~ predictions:", predictions);
          setSuggestions(predictions as []);
        }
      );
    }, 500),
    []
  );

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
      googleMapsApiKey={"AIzaSyDAAn3SBFQkx4n-mpBE6Agdd3pIaNA4ALw"}
      libraries={libraries}
    >
      <div className="location-search w-5/6">
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
              <span className="text-black">Share Location</span>
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
            }}
          />
        )}
      </div>
    </LoadScript>
  );
};

export default LocationSearch;
