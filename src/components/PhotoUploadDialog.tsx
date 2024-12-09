import React, { useState, useRef } from 'react';
import { Dialog, TextField } from '@mui/material';
import { Camera, X, Upload, ImagePlus, Trash2 } from 'lucide-react';
import { useTravelStore } from '../store/travelStore';
import { compressImage, validateImageFile } from '../utils/imageUtils';
import { PhotoUpload } from '../types';

interface PhotoUploadDialogProps {
  open: boolean;
  onClose: () => void;
  countryId: string;
  cityId: string;
}

export const PhotoUploadDialog: React.FC<PhotoUploadDialogProps> = ({
  open,
  onClose,
  countryId,
  cityId,
}) => {
  const [photos, setPhotos] = useState<PhotoUpload[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addPhotosToCity } = useTravelStore();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setError(null);
    setIsLoading(true);

    try {
      const newPhotos = await Promise.all(
        files.map(async (file) => {
          if (!validateImageFile(file)) {
            throw new Error(`Invalid file type: ${file.name}`);
          }
          const compressedImageUrl = await compressImage(file);
          return {
            file,
            caption: '',
            previewUrl: compressedImageUrl,
          };
        })
      );

      setPhotos((prev) => [...prev, ...newPhotos]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError('Error processing images. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCaptionChange = (index: number, caption: string) => {
    setPhotos((prev) =>
      prev.map((photo, i) =>
        i === index ? { ...photo, caption } : photo
      )
    );
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (photos.length > 0) {
      const photoData = photos.map((photo) => ({
        id: crypto.randomUUID(),
        url: photo.previewUrl,
        caption: photo.caption,
        date: new Date().toISOString(),
      }));
      
      addPhotosToCity(countryId, cityId, photoData);
      handleClose();
    }
  };

  const handleClose = () => {
    setPhotos([]);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Camera className="text-indigo-600" />
            Add Photos
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            multiple
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-indigo-500 transition-colors"
          >
            <ImagePlus size={32} className="text-gray-400" />
            <span className="text-gray-600">Click to upload multiple photos</span>
            <span className="text-sm text-gray-500">
              JPEG, PNG, GIF or WebP
            </span>
          </button>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          {isLoading && (
            <p className="text-gray-600 text-sm">Processing images...</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto">
            {photos.map((photo, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="relative">
                  <img
                    src={photo.previewUrl}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(index)}
                    className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-red-50"
                  >
                    <Trash2 size={18} className="text-red-600" />
                  </button>
                </div>
                <TextField
                  label={`Caption for photo ${index + 1}`}
                  value={photo.caption}
                  onChange={(e) => handleCaptionChange(index, e.target.value)}
                  fullWidth
                  multiline
                  rows={2}
                  size="small"
                  placeholder="Add a description..."
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">
            {photos.length} photo{photos.length !== 1 ? 's' : ''} selected
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={photos.length === 0 || isLoading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Add Photos
            </button>
          </div>
        </div>
      </form>
    </Dialog>
  );
};