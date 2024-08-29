import { useLazyQuery } from "@apollo/client";
import { useState, useEffect, useCallback } from "react";
import { GET_RESTAURANTS } from "../graphql/restaurants";

export const useCurrentLocation = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  }, []);

  return location;
};

export const useFetchRestaurants = (
  location: {
    lat: number | null;
    lng: number | null;
  } | null
) => {
  const [fetchRestaurants, { data, error, loading }] = useLazyQuery(
    GET_RESTAURANTS,
    {
      variables: {
        latitude: location?.lat ?? null,
        longitude: location?.lng ?? null,
      },
      onCompleted(data) {
        return data;
      },
    }
  );
  const fetchAllRestaurants = useCallback(
    (
      item: {
        lat: number | null;
        lng: number | null;
      } | null
    ) => {
      return fetchRestaurants({
        variables: {
          latitude: item?.lat ?? null,
          longitude: item?.lng ?? null,
        },
      });
    },
    []
  );
  if (error) {
    console.error("Error fetching restaurants:", error);
  }
  return {
    fetchAllRestaurants,
    data: data && data.nearByRestaurants,
    loading,
  };
};
