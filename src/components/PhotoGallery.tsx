import React, { useState } from 'react';
import { Dialog } from '@mui/material';
import { X, ChevronLeft, ChevronRight, Image } from 'lucide-react';
import { Photo } from '../types';

interface PhotoGalleryProps {
  open: boolean;
  onClose: () => void;
  photos: Photo[];
  cityName: string;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  open,
  onClose,
  photos,
  cityName,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  // If there are no photos, show a placeholder
  if (!photos || photos.length === 0) {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="xl"
        fullWidth
        PaperProps={{
          style: { backgroundColor: 'transparent', boxShadow: 'none' },
        }}
      >
        <div className="relative bg-black bg-opacity-90 min-h-[80vh] flex items-center justify-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-50"
          >
            <X size={24} />
          </button>
          <div className="text-center text-white">
            <Image size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-xl">No photos available for {cityName}</p>
          </div>
        </div>
      </Dialog>
    );
  }

  const currentPhoto = photos[currentIndex];

  // Safety check for currentPhoto
  if (!currentPhoto) {
    onClose();
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      PaperProps={{
        style: { backgroundColor: 'transparent', boxShadow: 'none' },
      }}
    >
      <div className="relative bg-black bg-opacity-90 min-h-[80vh] flex items-center justify-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 z-50"
        >
          <X size={24} />
        </button>

        {photos.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-4 text-white hover:text-gray-300 p-2 rounded-full bg-black bg-opacity-50"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-4 text-white hover:text-gray-300 p-2 rounded-full bg-black bg-opacity-50"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        <div className="max-w-5xl w-full px-12">
          <div className="relative aspect-[16/9]">
            <img
              src={currentPhoto.url}
              alt={currentPhoto.caption || `Photo from ${cityName}`}
              className="w-full h-full object-contain"
            />
          </div>
          {currentPhoto.caption && (
            <div className="absolute bottom-8 left-0 right-0 text-center">
              <p className="text-white text-lg bg-black bg-opacity-50 p-4 mx-auto max-w-2xl rounded">
                {currentPhoto.caption}
              </p>
            </div>
          )}
          {photos.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 text-center">
              <p className="text-gray-400 text-sm">
                {currentIndex + 1} / {photos.length}
              </p>
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
};