import React, { useState } from 'react';
import { Dialog, TextField, Autocomplete } from '@mui/material';
import { MapPin, Plus } from 'lucide-react';
import { useTravelStore } from '../store/travelStore';
import { countries as countryList } from '../data/countries';

export const AddTravelForm: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [cityName, setCityName] = useState('');
  const { addCountry, addCityToCountry } = useTravelStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCountry && cityName) {
      const country = countryList.find((c) => c.name === selectedCountry);
      if (country) {
        addCountry({
          id: crypto.randomUUID(),
          name: country.name,
          code: country.code,
          cities: [
            {
              id: crypto.randomUUID(),
              name: cityName,
              photos: [],
            },
          ],
        });
      }
      setOpen(false);
      setSelectedCountry(null);
      setCityName('');
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-8 right-8 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
      >
        <Plus size={24} />
      </button>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MapPin className="text-indigo-600" />
            Add New Travel
          </h2>
          
          <Autocomplete
            options={countryList.map((country) => country.name)}
            value={selectedCountry}
            onChange={(_, newValue) => setSelectedCountry(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Select Country" required />
            )}
          />

          <TextField
            label="City Name"
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
            fullWidth
            required
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Add Travel
            </button>
          </div>
        </form>
      </Dialog>
    </>
  );
};