"use client";
import React, { useState } from "react";
import Map from "./components/map/Map";
import Card from "./components/restaurants/Card";
import { useFetchRestaurants } from "./hooks/location";
import clsx from "clsx";
import Spinner from "./components/Spinner";

const Home: React.FC = () => {
  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const { fetchAllRestaurants, data, loading } = useFetchRestaurants(location);

  const handleLocationSelect = (location: { lat: number; lng: number }) => {
    setLocation(location);
  };
  const handleFetchRestaurants = () => {
    fetchAllRestaurants(location);
  };

  return (
    <>
      {loading && <Spinner />}
      <div className="h-screen">
        <div className="h-96 relative">
          <Map
            onLocationChange={(lat: number, lng: number) => {
              handleLocationSelect({ lat, lng });
            }}
            handleFetchRestaurants={handleFetchRestaurants}
          />
        </div>
        <div className="restaurants-list mt-96 h-auto bg-white">
          <div className="container mx-auto p-4">
            <h1
              className={clsx(
                "font-extrabold text-black text-4xl",
                !!data?.restaurants?.length &&
                  data?.restaurants?.length !== 0 &&
                  "mb-32"
              )}
            >
              All Restaurants
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
              {data && data?.restaurants?.length > 0 ? (
                data?.restaurants?.map((item: any) => {
                  return (
                    <Card
                      key={item._id}
                      imageSrc={item.image}
                      altText={item.name}
                      deliveryTime={item.deliveryTime}
                      title={item.name}
                      description="Signature Pizzas, Pizzas, Beverages"
                      rating="3.38/5 (8)"
                      minimumOrder={`Rs. ${item.minimumOrder}`}
                    />
                  );
                })
              ) : (
                <span className="text-fontGrey">
                  Please select the location to find restaurants.{" "}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
