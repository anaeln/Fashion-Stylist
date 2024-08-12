import React from 'react';
import { Stack, Typography, Box, Button, Icon } from '@mui/material';
import { useDropzone, DropzoneOptions } from 'react-dropzone';
import ImageCard from './ImageCard';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

interface ImageUploadSectionProps {
  imageUrl: string;
  clearImage: () => void;
  UploadImage: (file: File) => void;
}

const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({ imageUrl, clearImage, UploadImage }) => {
  const dropzoneOptions: DropzoneOptions = {
    accept: {
      'image/png': [],
      'image/jpeg': [],
      'image/jpg': [],
      'image/webp': [],
    },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        UploadImage(acceptedFiles[0]);
      }
    },
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone(dropzoneOptions);

  return (
    <Stack spacing={1} alignItems='center'>
      {imageUrl ? (
        <Stack spacing={1}>
          <Typography variant='h6' color='black'>
            Uploaded Image
          </Typography>
          <ImageCard imageUrl={imageUrl} />
          <Button variant='outlined' color='error' onClick={clearImage}>
            Clear Image
          </Button>
        </Stack>
      ) : (
        <Box
          height={250}
          width={450}
          alignContent='center'
          borderRadius={5}
          sx={{
            border: '2px dashed lightgray',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            backgroundColor: isDragActive ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
            borderColor: isDragActive ? 'primary.main' : 'lightgray',
          }}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <Stack spacing={1} alignItems='center' justifyContent='center' height='100%'>
            <Icon component={PhotoCameraIcon} sx={{ fontSize: 60, color: 'textSecondary' }} />
            <Typography variant='h6'>
              Drop your image here, or
              <Typography component='span' color='primary'>
                Browse
              </Typography>
            </Typography>
            <Typography variant='caption' color='textSecondary'>
              Supports: PNG, JPG, JPEG, WEBP
            </Typography>
          </Stack>
        </Box>
      )}
    </Stack>
  );
};

export default ImageUploadSection;
