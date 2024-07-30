import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { CircularProgress } from '@mui/material';

const VisuallyHiddenInput = styled('input')({
	clip: 'rect(0 0 0 0)',
	clipPath: 'inset(50%)',
	height: 1,
	overflow: 'hidden',
	position: 'absolute',
	bottom: 0,
	left: 0,
	whiteSpace: 'nowrap',
	width: 1,
});

interface FileUploadButtonProps {
	uploadImage: (event: any) => void;
	isLoading: boolean;
}

const FileUploadButton = ({ uploadImage, isLoading }: FileUploadButtonProps) => {
	return (
		<Button
			fullWidth
			component='label'
			variant='contained'
			tabIndex={-1}
			startIcon={
				isLoading ? <CircularProgress size={18} sx={{ color: 'white' }} /> : <CloudUploadIcon />
			}
			color='primary'>
			{isLoading ? 'uploading...' : 'Upload Image'}
			{isLoading ? null : <VisuallyHiddenInput type='file' onChange={uploadImage} />}
		</Button>
	);
};

export default FileUploadButton;
