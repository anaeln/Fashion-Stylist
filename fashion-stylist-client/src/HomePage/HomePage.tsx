import { useState } from 'react';
import FileUploadButton from './FileUploadButton';
import { Box, Stack } from '@mui/material';

const HomePage = () => {
	const [imageUrl, setImageUrl] = useState<string>('');

	const UploadImage = (event: any) => {
		setImageUrl(URL.createObjectURL(event.target.files[0]));
	};

	return (
		<>
			<Stack alignItems={'center'} spacing={4}>
				<Box height={500} width={500} alignContent='center'>
					<img src={imageUrl} style={{ maxHeight: '500px', maxWidth: '500px' }} />
				</Box>
				<FileUploadButton uploadImage={UploadImage} />
			</Stack>
		</>
	);
};

export default HomePage;
