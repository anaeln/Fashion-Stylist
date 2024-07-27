import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

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
}

const FileUploadButton = ({ uploadImage }: FileUploadButtonProps) => {
	return (
		<Button
			component='label'
			variant='contained'
			tabIndex={-1}
			startIcon={<CloudUploadIcon />}
			color='primary'>
			Upload Image
			<VisuallyHiddenInput type='file' onChange={uploadImage} />
		</Button>
	);
};

export default FileUploadButton;
