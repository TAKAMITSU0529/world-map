import React from 'react';
import MapChart from './components/WorldMap';
import { CountryList } from './components/CountryList';
import { AddTravelForm } from './components/AddTravelForm';
import { Globe } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-2">
            <Globe className="text-indigo-600" size={32} />
            <h1 className="text-3xl font-bold text-gray-900">
              World Travel Tracker
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <MapChart />
        <CountryList />
        <AddTravelForm />
      </main>

      <div className="h-24">
        {/* Space for the floating action button */}
      </div>
    </div>
  );
}

export default App;