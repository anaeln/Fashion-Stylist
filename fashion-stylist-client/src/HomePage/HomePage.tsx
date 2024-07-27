import { useState } from 'react';
import FileUploadButton from './FileUploadButton';
import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

const serverUrl = 'http://localhost:5000/';
const recommendationKey = 'recommendation';
const axiosConfig: AxiosRequestConfig<FormData> = {
	headers: { 'Content-Type': 'multipart/form-data' },
};

const HomePage = () => {
	const [imageUrl, setImageUrl] = useState<string>('');

	const {
		mutate: getRecommendation,
		data: recommendationImage,
		isSuccess: isRecommendationSuccess,
		isPending: isRecommendationPending,
	} = useMutation<AxiosResponse<string>, AxiosError, FormData>({
		mutationFn: (imageFormData: FormData) => axios.post(serverUrl, imageFormData, axiosConfig),
		mutationKey: [recommendationKey],
	});

	const UploadImage = (event: any) => {
		const file = event.target.files[0];
		setImageUrl(URL.createObjectURL(file));

		const formData: FormData = new FormData();
		formData.append('image', file);

		getRecommendation(formData);
	};

	return (
		<>
			<Stack alignItems='center' spacing={4} height='80vh' justifyContent='space-around'>
				<Stack direction='row' spacing={4} justifyContent='space-evenly' width='80vw'>
					<Stack spacing={1}>
						<Typography variant='h6' color='black'>
							Uploaded Image
						</Typography>
						<Box height={400} width={300} alignContent='center' border='dashed'>
							<img src={imageUrl} style={{ maxHeight: '400px', maxWidth: '300px' }} />
						</Box>
					</Stack>
					<Stack spacing={1}>
						<Typography variant='h6' color='black'>
							Recommendation
						</Typography>
						<Box height={400} width={300} alignContent='center' border='dashed'>
							{isRecommendationPending ? (
								<CircularProgress />
							) : isRecommendationSuccess ? (
								<img
									src={`data:image/jpg;base64,${recommendationImage.data}`}
									style={{ maxHeight: '400px', maxWidth: '300px' }}
								/>
							) : null}
						</Box>
					</Stack>
				</Stack>
				<FileUploadButton uploadImage={UploadImage} />
			</Stack>
		</>
	);
};

export default HomePage;
