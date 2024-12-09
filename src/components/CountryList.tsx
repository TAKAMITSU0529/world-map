import React, { useState } from 'react';
import { useTravelStore } from '../store/travelStore';
import { Camera, MapPin, Image } from 'lucide-react';
import { PhotoUploadDialog } from './PhotoUploadDialog';
import { PhotoGallery } from './PhotoGallery';
import * as flags from 'country-flag-icons/react/3x2';

interface PhotoModalState {
  isOpen: boolean;
  countryId: string;
  cityId: string;
}

interface GalleryState {
  isOpen: boolean;
  cityName: string;
  photos: any[];
}

export const CountryList: React.FC = () => {
  const { countries } = useTravelStore();
  const [photoModal, setPhotoModal] = useState<PhotoModalState>({
    isOpen: false,
    countryId: '',
    cityId: '',
  });
  const [galleryState, setGalleryState] = useState<GalleryState>({
    isOpen: false,
    cityName: '',
    photos: [],
  });

  const getFlagComponent = (countryCode: string) => {
    const Flag = (flags as any)[countryCode];
    return Flag ? <Flag className="w-6 h-4 inline-block mr-2" /> : null;
  };

  const handleOpenPhotoModal = (countryId: string, cityId: string) => {
    setPhotoModal({
      isOpen: true,
      countryId,
      cityId,
    });
  };

  const handleClosePhotoModal = () => {
    setPhotoModal({
      isOpen: false,
      countryId: '',
      cityId: '',
    });
  };

  const handleOpenGallery = (cityName: string, photos: any[]) => {
    setGalleryState({
      isOpen: true,
      cityName,
      photos,
    });
  };

  const handleCloseGallery = () => {
    setGalleryState({
      isOpen: false,
      cityName: '',
      photos: [],
    });
  };

  return (
    <>
      <div className="w-full space-y-6">
        {countries.map((country) => (
          <div
            key={country.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                {getFlagComponent(country.code)}
                {country.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {country.cities.map((city) => (
                  <div
                    key={city.id}
                    className="bg-gray-50 rounded-lg p-4 space-y-3"
                  >
                    <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                      <MapPin className="text-indigo-600" size={20} />
                      {city.name}
                    </h3>
                    {city.photos.length > 0 ? (
                      <div>
                        <button
                          onClick={() => handleOpenGallery(city.name, city.photos)}
                          className="w-full relative group"
                        >
                          <div className="grid grid-cols-2 gap-2">
                            {city.photos.slice(0, 4).map((photo, index) => (
                              <div
                                key={photo.id}
                                className={`relative ${
                                  index === 3 && city.photos.length > 4
                                    ? 'after:content-["+' +
                                      (city.photos.length - 4) +
                                      '"] after:absolute after:inset-0 after:bg-black after:bg-opacity-50 after:flex after:items-center after:justify-center after:text-white after:text-2xl after:font-bold'
                                    : ''
                                }`}
                              >
                                <img
                                  src={photo.url}
                                  alt={photo.caption || `Photo from ${city.name}`}
                                  className="w-full h-32 object-cover rounded-lg"
                                />
                              </div>
                            ))}
                          </div>
                          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-25 transition-opacity rounded-lg" />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="bg-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                              <Image size={20} className="text-indigo-600" />
                              <span className="text-gray-900">View All</span>
                            </span>
                          </div>
                        </button>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm italic">No photos yet</p>
                    )}
                    <button
                      onClick={() => handleOpenPhotoModal(country.id, city.id)}
                      className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors"
                    >
                      <Camera size={20} />
                      <span>Add Photo</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <PhotoUploadDialog
        open={photoModal.isOpen}
        onClose={handleClosePhotoModal}
        countryId={photoModal.countryId}
        cityId={photoModal.cityId}
      />

      <PhotoGallery
        open={galleryState.isOpen}
        onClose={handleCloseGallery}
        photos={galleryState.photos}
        cityName={galleryState.cityName}
      />
    </>
  );
};