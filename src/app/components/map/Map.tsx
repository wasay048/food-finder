import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import LocationSearch from "./LocationSearch";
import { Button } from "primereact/button";
import { LocationMarker } from "./LocationMarker";

export const locationPinIcon = new L.Icon({
  iconUrl: "/location.svg",
  iconSize: [30, 40],
  iconAnchor: [15, 40],
  popupAnchor: [0, -40],
});

interface MapProps {
  onLocationChange: (lat: number, lng: number) => void;
  handleFetchRestaurants: () => void;
}

const MapComponent: React.FC<{ setMapRef: (map: L.Map) => void }> = ({
  setMapRef,
}) => {
  const map = useMap();

  useEffect(() => {
    setMapRef(map);
  }, [map, setMapRef]);

  return null;
};

const Map: React.FC<MapProps> = ({
  onLocationChange,
  handleFetchRestaurants,
}) => {
  const defaultCenter = { lat: 33.738045, lng: 73.084488 };
  const mapRef = useRef<L.Map | null>();

  const mapBoxStyleUrl = process.env.NEXT_PUBLIC_MAP_BOX_STYLES;
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
    name: string;
  } | null>();

  const MapViewSetter = ({
    locations,
  }: {
    locations: {
      lat: number;
      lng: number;
      name: string;
    }[];
  }) => {
    const map = useMap();

    useEffect(() => {
      if (locations && locations.length > 0) {
        const bounds = L.latLngBounds(
          locations.map((loc) => [loc.lat, loc.lng])
        );
        map.fitBounds(bounds, { maxZoom: 18 });
      }
    }, [locations, map]);

    return null;
  };

  const handleUserLocation = (loc: {
    lat: number;
    lng: number;
    name: string;
  }) => {
    setUserLocation(loc);
    onLocationChange(loc.lat, loc.lng);
  };

  const getUserCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude: lat, longitude: lng } = position.coords;

          fetchPlaceName(lat, lng);
          if (mapRef.current) {
            mapRef.current.setView([lat, lng], 16);
            L.marker([lat, lng], { icon: locationPinIcon })
              .addTo(mapRef.current)
              .openPopup();
          }
        },
        () => {
          alert("Location access denied.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const fetchPlaceName = (lat: number, lng: number) => {
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${googleMapsApiKey}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data.status === "OK" && data.results.length > 0) {
          const placeName = data.results[0].formatted_address;
          setUserLocation({ lat, lng, name: placeName });
        } else {
          console.error("No address found for the given coordinates.");
          setUserLocation({ lat, lng, name: "Unknown Location" });
        }
      })
      .catch((error) => {
        console.error("Error fetching place name:", error);
        setUserLocation({ lat, lng, name: "Unknown Location" });
      });
  };

  return (
    <div className="relative ">
      <MapContainer
        center={[defaultCenter.lat, defaultCenter.lng]}
        zoom={12}
        maxZoom={30}
        style={{ height: "725px", width: "100%", zIndex: "1" }}
      >
        <MapComponent
          setMapRef={(mapInstance) => {
            mapRef.current = mapInstance;
          }}
        />
        <TileLayer
          url={mapBoxStyleUrl as string}
          attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a>'
        />
        {userLocation && (
          <>
            <MapViewSetter locations={[userLocation]} />
            <Marker
              position={[userLocation.lat, userLocation.lng]}
              icon={locationPinIcon}
            >
              <Popup>
                {userLocation.lat}, {userLocation.lng}
              </Popup>
            </Marker>
          </>
        )}
        <LocationMarker onLocationChange={handleUserLocation} />
      </MapContainer>
      <div className="hidden lg:block  xl:w-2/4 lg:w-4/5 items-center lg:left-[10%] xl:left-[20%]  absolute top-[40%]  bg-black p-4 shadow-md rounded z-10">
        <div className="flex justify-between">
          <LocationSearch
            placeName={userLocation?.name ?? ""}
            onLocationSelect={(location) => {
              onLocationChange(location.lat, location.lng);
              setUserLocation(location);
            }}
            handleFlyToLocation={getUserCurrentLocation}
          />
          <div className="justify-end w-60 ml-2">
            <Button
              label="Find Restaurants"
              onClick={handleFetchRestaurants}
              className="bg-successColor w-full md:w-auto border-successColor outline-successColor text-black border-[1px] p-3 rounded-full px-10 outline-none"
            />
          </div>
        </div>
      </div>
      <div className="w-full absolute top-[40%] bg-black bg-opacity-60 p-4 shadow-md rounded z-10 lg:hidden">
        <div className="flex flex-col items-center w-auto">
          <LocationSearch
            placeName={userLocation?.name ?? ""}
            onLocationSelect={(location) => {
              onLocationChange(location.lat, location.lng);
              setUserLocation(location);
            }}
            handleFlyToLocation={getUserCurrentLocation}
          />
          <div className="justify-end w-60 ml-2 mt-4">
            <Button
              label="Find Restaurants"
              onClick={handleFetchRestaurants}
              className="bg-successColor w-full md:w-auto border-successColor outline-successColor text-black border-[1px] p-3 rounded-xl px-10 outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;
