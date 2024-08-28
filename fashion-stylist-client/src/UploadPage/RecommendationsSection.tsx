import React, { useState } from 'react';
import { Stack, Typography, CircularProgress, Button } from '@mui/material';
import BasicCard from './BasicCard';

// Define types for the recommendations
interface Recommendation {
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
    recommendationImage: any
    isRecommendationPending: boolean;
    isRecommendationSuccess: boolean;
}

// Define category order
const categoryOrder = ['topwear', 'bottomwear', 'footwear'];

const RecommendationsSection: React.FC<RecommendationsSectionProps> = ({ recommendationImage, isRecommendationPending, isRecommendationSuccess }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Function to interleave lists of recommendations based on the predefined category order
    const interleaveLists = (lists: RecommendationsData) => {
        // Ensure the lists are in the correct order
        const orderedLists = categoryOrder.map(category => lists[category] || []);

        // Determine the maximum length to iterate over
        const maxLength = Math.max(...orderedLists.map(list => list.length));

        const rows = [];
        for (let i = 0; i < maxLength; i++) {
            // Create a row with one item from each list if it exists
            const row = orderedLists.map(list => list[i] || null).filter(item => item !== null);
            rows.push(row);
        }

        return rows;
    };

    // Flatten and interleave the lists
    const recommendationLists = recommendationImage?.data?.recommendations || {};
    const interleavedRows = interleaveLists(recommendationLists);

    // Function to go to the next line
    const goToNextLine = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % interleavedRows.length);
    };

    // Function to go to the previous line
    const goToPreviousLine = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + interleavedRows.length) % interleavedRows.length);
    };

    return (
        <Stack direction='column' spacing={4} justifyContent='space-evenly' width='80vw'>
            <Typography variant='h6' color='black'>
                Recommendations
            </Typography>
            {isRecommendationPending ? (
                <CircularProgress />
            ) : isRecommendationSuccess && recommendationImage?.data?.recommendations ? (
                <>
                    <Stack spacing={4}>
                        <Stack direction='row' spacing={2} justifyContent='space-evenly'>
                            {interleavedRows[currentIndex].map((recommendation, cardIndex) => (
                                <BasicCard
                                    key={cardIndex}
                                    link={recommendation?.link}
                                    title={recommendation?.title}
                                    price={recommendation?.price}
                                    img={recommendation?.img}
                                    brand={recommendation?.brand}
                                />
                            ))}
                        </Stack>
                    </Stack>
                    <Stack direction='row' spacing={2} justifyContent='center'>
                        <Button variant='contained' onClick={goToPreviousLine}>
                            Previous
                        </Button>
                        <Button variant='contained' onClick={goToNextLine}>
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
                                    backgroundColor: currentIndex === index ? 'black' : 'gray',
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
