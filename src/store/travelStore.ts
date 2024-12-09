import { create } from 'zustand';
import { Country, City, Photo } from '../types';

interface TravelStore {
  countries: Country[];
  addCountry: (country: Country) => void;
  addCityToCountry: (countryId: string, city: City) => void;
  addPhotosToCity: (countryId: string, cityId: string, photos: Photo[]) => void;
}

export const useTravelStore = create<TravelStore>((set) => ({
  countries: [],
  addCountry: (country) =>
    set((state) => ({
      countries: [...state.countries, country],
    })),
  addCityToCountry: (countryId, city) =>
    set((state) => ({
      countries: state.countries.map((country) =>
        country.id === countryId
          ? { ...country, cities: [...country.cities, city] }
          : country
      ),
    })),
  addPhotosToCity: (countryId, cityId, photos) =>
    set((state) => ({
      countries: state.countries.map((country) =>
        country.id === countryId
          ? {
              ...country,
              cities: country.cities.map((city) =>
                city.id === cityId
                  ? { ...city, photos: [...city.photos, ...photos] }
                  : city
              ),
            }
          : country
      ),
    })),
}));