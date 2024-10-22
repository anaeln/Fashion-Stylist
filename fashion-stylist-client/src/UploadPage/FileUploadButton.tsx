import { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { CircularProgress } from '@mui/material';

const DropZone = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isDragOver',
})<{ isDragOver?: boolean }>(({}) => ({}));

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
    uploadImage: (file: File) => void;
    isLoading: boolean;
}

const FileUploadButton = ({ uploadImage, isLoading }: FileUploadButtonProps) => {
    const [isDragOver, setIsDragOver] = useState(false);

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragOver(false);

        const files = event.dataTransfer.files;
        if (files.length > 0) {
            uploadImage(files[0]);
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    return (
        <DropZone
            isDragOver={isDragOver}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
        >
            <Button
                fullWidth
                component='label'
                variant='contained'
                tabIndex={-1}
                startIcon={
                    isLoading ? <CircularProgress size={18} sx={{ color: 'white' }} /> : <CloudUploadIcon />
                }
                color='primary'>
                {isLoading ? 'Uploading...' : 'Upload New Image'}
                <VisuallyHiddenInput type='file' onChange={(e) => e.target.files && uploadImage(e.target.files[0])} />
            </Button>
        </DropZone>
    );
};

export default FileUploadButton;