import { useState } from 'react';
import { Stack, Button } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import config from '../config';
import ImageUploadSection from './ImageUploadSection';
import RecommendationsSection from './RecommendationsSection';
import FileUploadButton from './FileUploadButton';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const recommendationKey = 'recommendation';
const axiosConfig: AxiosRequestConfig<FormData> = {
	headers: { 'Content-Type': 'multipart/form-data' },
};

const UploadPage = () => {
	const [imageUrl, setImageUrl] = useState<string>('');
	const [isRecommendationsView, setIsRecommendationsView] = useState(false);

	const {
		mutate: getRecommendation,
		data: recommendationImage,
		isSuccess: isRecommendationSuccess,
		isPending: isRecommendationPending,
	} = useMutation<AxiosResponse<any>, AxiosError, FormData>({
		mutationFn: (imageFormData: FormData) => axios.post(config.serverUrl, imageFormData, axiosConfig),
		mutationKey: [recommendationKey],
	});

	const UploadImage = (event: any) => {
		const file = event.target.files[0];
		setImageUrl(URL.createObjectURL(file));

		const formData: FormData = new FormData();
		formData.append('image', file);

		getRecommendation(formData);
	};

	const clearImage = () => {
		setImageUrl('');
	};

	const toggleRecommendationsView = () => {
		setIsRecommendationsView((isView) => !isView);
	};

	return (
		<Stack alignItems='center' spacing={4} justifyContent='space-around' m={5}>
			{!isRecommendationsView ? (
				<ImageUploadSection
					imageUrl={imageUrl}
					clearImage={clearImage}
					UploadImage={UploadImage}
				/>
			) : (
				<RecommendationsSection
					recommendationImage={recommendationImage}
					isRecommendationPending={isRecommendationPending}
					isRecommendationSuccess={isRecommendationSuccess}
				/>
			)}
			<Stack spacing={2} height='20vw' width='305px'>
				<FileUploadButton isLoading={isRecommendationPending} uploadImage={UploadImage} />
				{isRecommendationSuccess ? (
					<Button
						variant='contained'
						color='success'
						onClick={toggleRecommendationsView}
						startIcon={isRecommendationsView ? <ArrowBackIcon /> : <DoneAllIcon />}
					>
						{isRecommendationsView ? 'Go Back' : 'See Results'}
					</Button>
				) : null}
			</Stack>
		</Stack>
	);
};

export default UploadPage;
