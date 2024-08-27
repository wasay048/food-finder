"use client";
import React, { useState } from "react";
import { ApolloProvider } from "@apollo/client";
import client from "./apollo-client";
import Map from "./components/map/Map";
import LocationSearch from "./components/map/LocationSearch";
import { useFetchRestaurants } from "./graphql/query";

const Home: React.FC = () => {
  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const handleLocationSelect = (location: { lat: number; lng: number }) => {
    setLocation(location);
    // fetchAllRestaurants(location);
  };

  return (
    <ApolloProvider client={client}>
      <div className="h-96">
        <Map
          onLocationChange={(lat: number, lng: number) => {
            handleLocationSelect({ lat, lng });
          }}
        />
      </div>
    </ApolloProvider>
  );
};

export default Home;
