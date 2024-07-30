import { useState } from 'react';
import FileUploadButton from './FileUploadButton';
import { Box, Button, CircularProgress, Stack, Tooltip, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import ImageCard from './ImageCard';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const serverUrl = 'http://localhost:5000/';
const recommendationKey = 'recommendation';
const axiosConfig: AxiosRequestConfig<FormData> = {
	headers: { 'Content-Type': 'multipart/form-data' },
};

const HomePage = () => {
	const [imageUrl, setImageUrl] = useState<string>('');
	const [isRecommendationsView, setIsRecommendationsView] = useState(false);

	const {
		mutate: getRecommendation,
		data: recommendationImage,
		isSuccess: isRecommendationSuccess,
		isPending: isRecommendationPending,
	} = useMutation<AxiosResponse<any>, AxiosError, FormData>({
		mutationFn: (imageFormData: FormData) => axios.post(serverUrl, imageFormData, axiosConfig),
		mutationKey: [recommendationKey],
	});

	console.log(
		recommendationImage?.data?.recommendations &&
			Object.values(recommendationImage?.data?.recommendations).map((recommendation: any) => {
				console.log(recommendation[0]);
			})
	);

	const UploadImage = (event: any) => {
		goToUploadFileView();
		const file = event.target.files[0];
		setImageUrl(URL.createObjectURL(file));

		const formData: FormData = new FormData();
		formData.append('image', file);

		getRecommendation(formData);
	};

	const toggleRecommendationsView = () => {
		setIsRecommendationsView((isView) => !isView);
	};

	const goToUploadFileView = () => {
		console.log('here');
		setIsRecommendationsView(false);
	};

	return (
		<>
			<Stack alignItems='center' spacing={4} height='80vh' justifyContent='space-around'>
				{!isRecommendationsView ? (
					<Stack spacing={1}>
						<Typography variant='h6' color='black'>
							Uploaded Image
						</Typography>
						<ImageCard imageUrl={imageUrl} />
					</Stack>
				) : (
					<Stack direction='row' spacing={4} justifyContent='space-evenly' width='80vw'>
						<Stack spacing={1}>
							<Typography variant='h6' color='black'>
								Recommendations
							</Typography>
							{isRecommendationPending ? (
								<CircularProgress />
							) : isRecommendationSuccess && recommendationImage?.data?.recommendations ? (
								<Stack direction='row' spacing={1}>
									{Object.values(recommendationImage?.data?.recommendations).map(
										(recommendation: any) => (
											<Tooltip title={`click me to buy this ${recommendation?.[0]?.link}`}>
												<Box
													height={400}
													width={300}
													alignContent='center'
													border='dashed'
													sx={{ cursor: 'pointer' }}
													onClick={() => window.open(recommendation?.[0]?.link)}
													key={recommendation?.[0]?.img}>
													<img
														src={recommendation?.[0]?.img}
														style={{ maxHeight: '400px', maxWidth: '300px' }}
													/>
												</Box>
											</Tooltip>
										)
									)}
								</Stack>
							) : null}
						</Stack>
					</Stack>
				)}
				<Stack spacing={2} height='20vw' width='305px'>
					<FileUploadButton isLoading={isRecommendationPending} uploadImage={UploadImage} />
					{isRecommendationSuccess ? (
						<Button
							variant='contained'
							color='success'
							onClick={toggleRecommendationsView}
							startIcon={isRecommendationsView ? <ArrowBackIcon /> : <DoneAllIcon />}>
							{isRecommendationsView ? 'Go Back' : 'See Results'}
						</Button>
					) : null}
				</Stack>
			</Stack>
		</>
	);
};

export default HomePage;
