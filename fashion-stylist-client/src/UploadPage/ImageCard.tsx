import { Box } from '@mui/material';

interface ImageCardProps {
	imageUrl: string;
}

const ImageCard = ({ imageUrl }: ImageCardProps) => {
	return (
		<Box height={400} width={300} alignContent='center' border='dashed'>
			<img src={imageUrl} style={{ maxHeight: '400px', maxWidth: '300px' }} />
		</Box>
	);
};

export default ImageCard;
