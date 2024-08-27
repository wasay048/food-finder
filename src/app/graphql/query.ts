import { gql, useMutation, useQuery } from "@apollo/client";
import { useCallback, useState } from "react";

const GET_RESTAURANTS = gql`
  mutation Restaurants($latitude: Float, $longitude: Float) {
    nearByRestaurants(latitude: $latitude, longitude: $longitude) {
      offers {
        _id
        name
        tag
        restaurants
      }
      sections {
        _id
        name
        restaurants
      }
      restaurants {
        _id
        name
        image
        slug
        address
        location {
          coordinates
        }
        deliveryTime
        minimumOrder
        tax
        reviewData {
          total
          ratings
          reviews {
            _id
          }
        }
        categories {
          _id
          title
          foods {
            _id
            title
          }
        }
        rating
        isAvailable
        openingTimes {
          day
          times {
            startTime
            endTime
          }
        }
      }
    }
  }
`;

export const useFetchRestaurants = (
  location: {
    lat: number | null;
    lng: number | null;
  } | null
) => {
  const [fetchRestaurants, { data, error }] = useMutation(GET_RESTAURANTS, {
    variables: { latitude: location?.lat, longitude: location?.lng },
  });
  const [restaurantsData, setRestaurantsData] = useState(data);
  const fetchAllRestaurants = useCallback(
    (item: { lat: number; lng: number }) => {
      return fetchRestaurants({
        variables: { latitude: item?.lat, longitude: item?.lng },
        update: (cache, result) => {
          console.log("result", result);
          setRestaurantsData(result);
        },
      });
    },
    []
  );
  if (error) {
    console.error("Error fetching restaurants:", error);
  }
  console.log("🚀 ~ Restaurants ~ data:", data);
  return {
    fetchAllRestaurants,
    data: data && data.nearByRestaurants,
  };
};
