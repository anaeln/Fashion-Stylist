import React, { useState, useEffect } from 'react';
import { Stack, CircularProgress, Button } from '@mui/material';
import BasicCard from './BasicCard';
import axios from 'axios';

interface Recommendation {
  _id: string;
  link: string;
  title: string;
  price: string;
  img: string;
  brand: string;
}

interface RecommendationsData {
  [key: string]: Recommendation[];
}

interface RecommendationsSectionProps {
  recommendationImage: any;
  isRecommendationPending: boolean;
  isRecommendationSuccess: boolean;
}

const categoryOrder = ['topwear', 'bottomwear', 'footwear'];

const RecommendationsSection: React.FC<RecommendationsSectionProps> = ({ recommendationImage, isRecommendationPending, isRecommendationSuccess }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favoritesArray, setFavoritesArray] = useState<any[]>([]);
  const [isUpdatingFavorites, setIsUpdatingFavorites] = useState(false);
  const [isUserConnected, setIsUserConnected] = useState(false); // New state for user connection

  const fetchFavorites = async () => {
    try {
      const response = await axios.get('http://localhost:5000/userInfo', { withCredentials: true });
      setFavoritesArray(response.data.favorites);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const checkUserConnection = async () => {
    try {
      const response = await axios.get('http://localhost:5000/profile', { withCredentials: true });
      setIsUserConnected(response.status === 200);
      if (response.status === 200) {
        await fetchFavorites(); // Fetch favorites if the user is connected
      } else {
        setFavoritesArray([]);
      }
    } catch (error) {
      setIsUserConnected(false);
      setFavoritesArray([]);
    }
  };

  useEffect(() => {
    checkUserConnection();
  }, []);

  useEffect(() => {
    setCurrentIndex(0);
  }, [recommendationImage]);

  const interleaveLists = (lists: RecommendationsData) => {
    const orderedLists = categoryOrder.map(category => lists[category] || []);
    const maxLength = Math.max(...orderedLists.map(list => list.length));
    const rows = [];
    for (let i = 0; i < maxLength; i++) {
      const row = orderedLists.map(list => list[i] || null).filter(item => item !== null);
      rows.push(row);
    }
    return rows;
  };

  const recommendationLists = recommendationImage?.data?.recommendations || {};
  const interleavedRows = interleaveLists(recommendationLists);

  const goToNextLine = () => {
    if (!isUpdatingFavorites) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % interleavedRows.length);
    }
  };

  const goToPreviousLine = () => {
    if (!isUpdatingFavorites) {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + interleavedRows.length) % interleavedRows.length);
    }
  };

  function heartState(recommendation: Recommendation) {
    return isUserConnected ? favoritesArray.some(fav => fav.id === recommendation._id) : false;
  }

  return (
    <Stack direction='column' spacing={4} justifyContent='space-evenly' width='80vw'>
      {isRecommendationPending ? (
        <CircularProgress />
      ) : isRecommendationSuccess && recommendationImage?.data?.recommendations ? (
        <>
          <Stack spacing={4}>
            <Stack direction='row' spacing={2} justifyContent='space-evenly'>
              {interleavedRows[currentIndex].map((recommendation, cardIndex) => (
                <BasicCard
                  key={cardIndex}
                  id={recommendation?._id}
                  link={recommendation?.link}
                  title={recommendation?.title}
                  price={recommendation?.price}
                  img={recommendation?.img}
                  brand={recommendation?.brand}
                  isHeartFull={heartState(recommendation)}
                  onHeartChange={() => {
                    setIsUpdatingFavorites(true);
                    fetchFavorites().finally(() => setIsUpdatingFavorites(false));
                  }}
                  isUserConnected={isUserConnected}
                />
              ))}
            </Stack>
          </Stack>
          <Stack direction='row' spacing={2} justifyContent='center' sx={{ id: 'prevNextStack' }}>
            <Button
              variant='contained'
              onClick={goToPreviousLine}
              sx={{ width: '100px' }}
              disabled={isUpdatingFavorites}
              className={isUpdatingFavorites ? 'button-disabled' : ''}
            >
              Previous
            </Button>
            <Button
              variant='contained'
              onClick={goToNextLine}
              sx={{ width: '100px' }}
              disabled={isUpdatingFavorites}
              className={isUpdatingFavorites ? 'button-disabled' : ''}
            >
              Next
            </Button>
          </Stack>
          <Stack direction='row' spacing={1} justifyContent='center' mt={2}>
            {interleavedRows.map((_, index) => (
              <div
                key={index}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: currentIndex === index ? 'blue' : 'lightblue',
                  margin: '0 2px',
                }}
              />
            ))}
          </Stack>
        </>
      ) : null}
    </Stack>
  );
};

export default RecommendationsSection;