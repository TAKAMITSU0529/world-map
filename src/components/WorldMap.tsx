import React, { useState, useEffect } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from 'react-simple-maps';
import { feature } from 'topojson-client';
import { useTravelStore } from '../store/travelStore';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const MapChart: React.FC = () => {
  const { countries } = useTravelStore();
  const visitedCountryCodes = countries.map((country) => country.code);
  const [position, setPosition] = useState({ coordinates: [0, 20], zoom: 1 });
  const [geographyData, setGeographyData] = useState<any>(null);

  useEffect(() => {
    fetch(geoUrl)
      .then(response => response.json())
      .then(data => {
        const countries = feature(data, data.objects.countries);
        setGeographyData(countries);
      });
  }, []);

  const handleMoveEnd = (position: { coordinates: [number, number]; zoom: number }) => {
    setPosition(position);
  };

  if (!geographyData) {
    return (
      <div className="w-full bg-white rounded-xl shadow-lg p-6">
        <div className="h-[500px] flex items-center justify-center">
          <div className="text-gray-500">Loading map...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-xl shadow-lg p-6">
      <div className="h-[500px] relative">
        <ComposableMap
          projection="geoEqualEarth"
          projectionConfig={{
            scale: 200,
            center: [0, 0]
          }}
        >
          <ZoomableGroup
            zoom={position.zoom}
            center={position.coordinates as [number, number]}
            onMoveEnd={handleMoveEnd}
            maxZoom={5}
          >
            <Geographies geography={geographyData}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const isVisited = visitedCountryCodes.includes(geo.properties.ISO_A2);
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={isVisited ? '#4F46E5' : '#E5E7EB'}
                      stroke="#FFFFFF"
                      strokeWidth={0.5}
                      style={{
                        default: {
                          outline: 'none',
                          transition: 'all 250ms'
                        },
                        hover: {
                          fill: isVisited ? '#6366F1' : '#D1D5DB',
                          outline: 'none',
                          cursor: 'pointer'
                        },
                        pressed: {
                          fill: isVisited ? '#4338CA' : '#9CA3AF',
                          outline: 'none'
                        }
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
        <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-md p-2 text-sm text-gray-600">
          Use mouse wheel to zoom and drag to pan
        </div>
      </div>
    </div>
  );
};

export default MapChart;