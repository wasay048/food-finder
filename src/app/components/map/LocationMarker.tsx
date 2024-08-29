import { useState } from "react";
import { Marker, Popup, useMapEvents } from "react-leaflet";
import { locationPinIcon } from "./Map";

export const LocationMarker: React.FC<{
  onLocationChange: (location: {
    lat: number;
    lng: number;
    name: string;
  }) => void;
}> = ({ onLocationChange }) => {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [locationName, setLocationName] = useState<string>("");

  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition({ lat, lng });

      fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${googleMapsApiKey}`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data: any) => {
          if (data.status === "OK" && data.results.length > 0) {
            const placeName = data.results[0].formatted_address;
            setLocationName(placeName);

            onLocationChange({ lat, lng, name: placeName });
          } else {
            console.error("No address found for the given coordinates.");
            onLocationChange({ lat, lng, name: "Unknown Location" });
          }
        })
        .catch((error) => {
          console.error("Error fetching place name:", error);
          onLocationChange({ lat, lng, name: "Unknown Location" });
        });
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={locationPinIcon}>
      <Popup>{locationName}</Popup>
    </Marker>
  );
};
