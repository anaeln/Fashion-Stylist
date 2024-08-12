import React from 'react';
import { Stack, Typography, CircularProgress, Tooltip } from '@mui/material';
import BasicCard from './BasicCard';

interface RecommendationsSectionProps {
	recommendationImage: any;
	isRecommendationPending: boolean;
	isRecommendationSuccess: boolean;
}

const RecommendationsSection: React.FC<RecommendationsSectionProps> = ({ recommendationImage, isRecommendationPending, isRecommendationSuccess }) => {
	return (
		<Stack direction='row' spacing={4} justifyContent='space-evenly' width='80vw'>
			<Stack spacing={1}>
				<Typography variant='h6' color='black'>
					Recommendations
				</Typography>
				{isRecommendationPending ? (
					<CircularProgress />
				) : isRecommendationSuccess && recommendationImage?.data?.recommendations ? (
					<Stack direction='row' spacing={1}>
						{Object.values(recommendationImage?.data?.recommendations).map((recommendation: any) => (
							<Tooltip title={`click me to buy this ${recommendation?.[0]?.link}`} key={recommendation?.[0]?.link}>
								<BasicCard 
									link={recommendation?.[0]?.link} 
									title={recommendation?.[0].title}
									price={recommendation?.[0].price}
									img={recommendation?.[0].img}
									brand={recommendation?.[0].brand}
								/>
							</Tooltip>
						))}
					</Stack>
				) : null}
			</Stack>
		</Stack>
	);
};

export default RecommendationsSection;
