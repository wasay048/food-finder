import React, { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import LocationSearch from "./LocationSearch";
import { Button } from "primereact/button";
import { useFetchRestaurants } from "src/app/graphql/query";

const locationPinIcon = new L.Icon({
  iconUrl:
    "https://www.freepik.com/free-vector/location_2900811.htm#query=location%20pin%20png&position=1&from_view=keyword&track=ais_hybrid&uuid=f780aa15-cf27-4fa5-ae88-2be61b8270b8", // Replace this with the URL to your location pin image
  iconSize: [30, 40], // Adjust size based on your image
  iconAnchor: [15, 40], // Adjust based on your image
  popupAnchor: [0, -40],
});
const LocationMarker: React.FC<{
  onLocationChange: (lat: number, lng: number) => void;
}> = ({ onLocationChange }) => {
  const [position, setPosition] = useState<L.LatLng | null>(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationChange(e.latlng.lat, e.latlng.lng);
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={locationPinIcon}>
      <Popup>You clicked here</Popup>
    </Marker>
  );
};

interface MapProps {
  onLocationChange: (lat: number, lng: number) => void;
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
const Map: React.FC<MapProps> = ({ onLocationChange }) => {
  const defaultCenter = { lat: 33.738045, lng: 73.084488 };
  const mapRef = useRef<L.Map | null>();

  const mapboxAccessToken =
    "pk.eyJ1IjoiYWJkdWx3YXNheSIsImEiOiJja3N0YWp5aHcwbWxhMnZtbGRhZzdudWxmIn0.r9SQfFwkyliVpkHdWViP5A";
  const mapboxStyleUrl =
    "https://api.mapbox.com/styles/v1/abdulwasay/cm0a1gffd00ma01pl1b7vcei1/tiles/256/{z}/{x}/{y}@2x?access_token=" +
    mapboxAccessToken;

  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
    name: string;
  } | null>();
  const { fetchAllRestaurants, data } = useFetchRestaurants({
    lat: userLocation?.lat ?? null,
    lng: userLocation?.lng ?? null,
  });
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

  const handleFlyToLocation = () => {
    const map = mapRef.current;
    if (!map) return;

    map.locate({
      setView: true,
      maxZoom: 16,
    });

    map.on("locationfound", (e) => {
      const { lat, lng } = e.latlng;
      setUserLocation({ lat, lng, name: "Home" });
      map.flyTo([lat, lng], map.getZoom());

      L.marker([lat, lng]).addTo(map).bindPopup("You are here!").openPopup();
    });

    map.on("locationerror", () => {
      alert("Location access denied.");
    });
  };

  return (
    <div className="relative ">
      <MapContainer
        center={[defaultCenter.lat, defaultCenter.lng]}
        zoom={15}
        maxZoom={30}
        style={{ height: "725px", width: "100%", zIndex: "1" }}
      >
        <MapComponent
          setMapRef={(mapInstance) => {
            mapRef.current = mapInstance;
          }}
        />
        <TileLayer
          url={mapboxStyleUrl}
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
        <LocationMarker onLocationChange={onLocationChange} />
      </MapContainer>
      <div className="w-1/2 absolute top-[40%] left-1/4 bg-black p-4 shadow-md rounded z-10">
        <div className="flex justify-between">
          <LocationSearch
            onLocationSelect={(location) => {
              onLocationChange(location.lat, location.lng);
              fetchAllRestaurants({ lat: location.lat, lng: location.lng });
              setUserLocation(location);
            }}
            handleFlyToLocation={handleFlyToLocation}
          />
          <div className="justify-end w-60 ml-2">
            <Button
              label="Find Restaurants"
              className="bg-successColor w-full md:w-auto border-successColor outline-successColor text-black border-[1px] p-3 rounded-full px-10 "
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;
