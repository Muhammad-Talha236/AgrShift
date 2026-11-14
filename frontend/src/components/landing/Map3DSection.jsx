import React, { useEffect, useRef, useState } from 'react';
import { MountainIcon, CompassIcon, LayersIcon, MapPinIcon } from '../common/Icons';

// Comprehensive preset list of agricultural & major centers (including major Pakistan agricultural cities)
const PRESET_LOCATIONS = [
  {
    name: 'Lahore',
    region: 'Punjab, Pakistan',
    coordinates: [74.3587, 31.5204],
    description: 'Heart of central Punjab fertile plains; major wheat, rice, and vegetable production belt.',
    crops: ['Wheat', 'Rice', 'Vegetables', 'Maize'],
  },
  {
    name: 'Faisalabad',
    region: 'Punjab, Pakistan',
    coordinates: [73.0845, 31.4504],
    description: 'Pakistan’s agricultural textile & farming research capital (Chenab & Ravi canal system).',
    crops: ['Cotton', 'Wheat', 'Sugarcane', 'Maize'],
  },
  {
    name: 'Multan',
    region: 'South Punjab, Pakistan',
    coordinates: [71.4753, 30.1575],
    description: 'World-renowned mango belt, high-yielding cotton, wheat, and sugarcane croplands.',
    crops: ['Cotton', 'Mangoes', 'Wheat', 'Sugarcane'],
  },
  {
    name: 'Sahiwal',
    region: 'Punjab, Pakistan',
    coordinates: [73.1068, 30.6682],
    description: 'Dense agricultural canal colony known for prime dairy, maize, potato, and wheat rotations.',
    crops: ['Potato', 'Maize', 'Wheat', 'Cotton'],
  },
  {
    name: 'Sargodha',
    region: 'Punjab, Pakistan',
    coordinates: [72.6711, 32.0836],
    description: 'Citrus capital of Pakistan with extensive wheat, sugarcane, and citrus orchards.',
    crops: ['Citrus', 'Sugarcane', 'Wheat', 'Rice'],
  },
  {
    name: 'Karachi & Malir',
    region: 'Sindh, Pakistan',
    coordinates: [67.0011, 24.8607],
    description: 'Coastal agro-economic corridor and peri-urban vegetable & fruit farming in Malir basin.',
    crops: ['Vegetables', 'Fodder', 'Fruits'],
  },
  {
    name: 'Hyderabad & Indus Delta',
    region: 'Sindh, Pakistan',
    coordinates: [68.3578, 25.396],
    description: 'Lower Indus irrigated agriculture; high sugarcane, cotton, wheat, and banana yields.',
    crops: ['Sugarcane', 'Cotton', 'Wheat', 'Banana'],
  },
  {
    name: 'Peshawar Valley',
    region: 'KPK, Pakistan',
    coordinates: [71.5249, 34.0151],
    description: 'Kabul River basin agriculture producing prime sugarcane, maize, tobacco, and wheat.',
    crops: ['Sugarcane', 'Maize', 'Tobacco', 'Wheat'],
  },
  {
    name: 'Nile Delta',
    region: 'Lower Egypt',
    coordinates: [31.5085, 30.5852],
    description: 'Centuries of silt-rich river deposition sustaining intensive agricultural cycles.',
    crops: ['Cotton', 'Rice', 'Wheat', 'Maize'],
  },
  {
    name: 'Midwestern Corn Belt',
    region: 'Iowa, United States',
    coordinates: [-93.6208, 41.5868],
    description: 'Prime agricultural mollisols supporting high-yield mechanized grain farming.',
    crops: ['Maize', 'Soybean'],
  },
  {
    name: 'Great Rift Valley',
    region: 'Nakuru, Kenya',
    coordinates: [36.08, -0.303],
    description: 'Volcanic highland soils with bimodal rainfall supporting diverse crops.',
    crops: ['Maize', 'Wheat', 'Sorghum'],
  },
  {
    name: 'Cerrado Savanna',
    region: 'Mato Grosso, Brazil',
    coordinates: [-55.72, -12.68],
    description: 'Vast tropical savanna transformed into a modern global agricultural breadbasket.',
    crops: ['Soybean', 'Cotton', 'Maize'],
  },
];

export default function Map3DSection({ mapConfig }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const clickMarkerRef = useRef(null);
  const searchContainerRef = useRef(null);

  const [activeLocation, setActiveLocation] = useState(PRESET_LOCATIONS[0]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(null);
  const [is3DActive, setIs3DActive] = useState(true);
  const [showLabels, setShowLabels] = useState(true);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setSearchDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter presets or query Nominatim
  const handleSearchChange = async (e) => {
    const val = e.target.value;
    setSearchQuery(val);

    if (!val || val.trim().length < 2) {
      setSearchResults([]);
      setSearchDropdownOpen(false);
      return;
    }

    setSearchDropdownOpen(true);

    // 1. First search local presets
    const localMatches = PRESET_LOCATIONS.filter(
      (loc) =>
        loc.name.toLowerCase().includes(val.toLowerCase()) ||
        loc.region.toLowerCase().includes(val.toLowerCase())
    ).map((loc) => ({
      name: loc.name,
      displayName: `${loc.name}, ${loc.region}`,
      coordinates: loc.coordinates,
      description: loc.description,
      crops: loc.crops,
    }));

    // If local match found, show immediately
    setSearchResults(localMatches);

    // 2. Query Nominatim for global cities/places
    try {
      setIsSearching(true);
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          val
        )}&limit=6&addressdetails=1`
      );
      if (res.ok) {
        const data = await res.json();
        const apiResults = data.map((item) => ({
          name: item.name || item.display_name.split(',')[0],
          displayName: item.display_name,
          coordinates: [parseFloat(item.lon), parseFloat(item.lat)],
          description: `Geographical Area (${item.type || 'City/Region'})`,
          crops: ['Custom Agricultural Zone'],
        }));

        // Merge without duplicate coordinates
        const combined = [...localMatches];
        apiResults.forEach((apiItem) => {
          const exists = combined.some(
            (c) =>
              Math.abs(c.coordinates[0] - apiItem.coordinates[0]) < 0.05 &&
              Math.abs(c.coordinates[1] - apiItem.coordinates[1]) < 0.05
          );
          if (!exists) {
            combined.push(apiItem);
          }
        });
        setSearchResults(combined.slice(0, 8));
      }
    } catch (err) {
      console.warn('Geocoding search notice:', err.message);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectLocation = (loc) => {
    setActiveLocation(loc);
    setSearchQuery(loc.name);
    setSearchDropdownOpen(false);

    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo({
        center: loc.coordinates,
        zoom: 11.5,
        pitch: 62,
        bearing: -15,
        essential: true,
        duration: 2200,
      });

      // Update or drop dynamic pin
      dropPinAt(loc.coordinates, loc.name, loc.description || loc.displayName);
    }
  };

  const dropPinAt = (coords, title, subtitle) => {
    if (!window.maplibregl || !mapInstanceRef.current) return;

    if (clickMarkerRef.current) {
      clickMarkerRef.current.remove();
    }

    const el = document.createElement('div');
    el.className =
      'w-9 h-9 rounded-full bg-[#10b981] border-2 border-white shadow-xl flex items-center justify-center text-white cursor-pointer hover:scale-125 transition-transform duration-200';
    el.innerHTML = `
      <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    `;

    const popup = new window.maplibregl.Popup({ offset: 25 }).setHTML(`
      <div style="font-family: 'Inter', sans-serif;">
        <div style="font-size: 15px; font-weight: 700; color: #173D2A; margin-bottom: 2px;">
          ${title}
        </div>
        <div style="font-size: 12px; color: #4b5563; line-height: 1.4; margin-bottom: 4px;">
          ${subtitle}
        </div>
        <div style="font-size: 11px; font-family: monospace; color: #245B3C; font-weight: 600;">
          [${coords[1].toFixed(4)}°N, ${coords[0].toFixed(4)}°E]
        </div>
      </div>
    `);

    clickMarkerRef.current = new window.maplibregl.Marker({ element: el })
      .setLngLat(coords)
      .setPopup(popup)
      .addTo(mapInstanceRef.current);

    popup.addTo(mapInstanceRef.current);
  };

  useEffect(() => {
    let map = null;

    const initMap = () => {
      if (!window.maplibregl) {
        setMapError('MapLibre GL library loading... Please check your internet connection.');
        return;
      }

      if (!mapContainerRef.current) return;

      try {
        // High-resolution Satellite Base Layer + Official World Boundaries & City Place Labels Layer
        map = new window.maplibregl.Map({
          container: mapContainerRef.current,
          style: {
            version: 8,
            sources: {
              'satellite-tiles': {
                type: 'raster',
                tiles: [
                  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                ],
                tileSize: 256,
                attribution: '&copy; Esri, Maxar, Earthstar Geographics, USDA, USGS',
              },
              'satellite-labels': {
                type: 'raster',
                tiles: [
                  'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
                ],
                tileSize: 256,
              },
              'terrain-source': {
                type: 'raster-dem',
                tiles: [
                  'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png',
                ],
                encoding: 'terrarium',
                tileSize: 256,
                maxzoom: 15,
              },
            },
            layers: [
              {
                id: 'satellite-layer',
                type: 'raster',
                source: 'satellite-tiles',
                minzoom: 0,
                maxzoom: 19,
              },
              {
                id: 'satellite-labels-layer',
                type: 'raster',
                source: 'satellite-labels',
                minzoom: 0,
                maxzoom: 19,
              },
            ],
            sky: {
              'sky-color': '#87ceeb',
              'sky-horizon-blend': 0.5,
              'horizon-color': '#eaf2e9',
              'horizon-fog-blend': 0.8,
              'fog-color': '#f8faf7',
              'fog-ground-blend': 0.5,
            },
          },
          center: [74.3587, 31.5204], // Initialized on Lahore / Indus Basin
          zoom: 10,
          pitch: 62,
          bearing: -20,
          maxPitch: 85,
        });

        // Add 3D Navigation & Zoom controls
        map.addControl(new window.maplibregl.NavigationControl({ visualizePitch: true }), 'top-right');
        map.addControl(new window.maplibregl.ScaleControl(), 'bottom-left');

        map.on('load', () => {
          // Enable actual 3D terrain elevation relief
          try {
            map.setTerrain({ source: 'terrain-source', exaggeration: 1.6 });
          } catch (terrainErr) {
            console.warn('3D Terrain relief notice:', terrainErr);
          }

          // Add preset agricultural markers
          PRESET_LOCATIONS.forEach((loc) => {
            const el = document.createElement('div');
            el.className =
              'w-8 h-8 rounded-full bg-[#245B3C] border-2 border-white shadow-lg flex items-center justify-center text-white cursor-pointer hover:scale-125 transition-transform duration-200';
            el.innerHTML = `
              <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
              </svg>
            `;

            const popup = new window.maplibregl.Popup({ offset: 25 }).setHTML(`
              <div style="font-family: 'Inter', sans-serif;">
                <div style="font-size: 11px; font-weight: 700; color: #245B3C; text-transform: uppercase; margin-bottom: 2px;">
                  ${loc.region}
                </div>
                <div style="font-size: 14px; font-weight: 700; color: #173D2A; margin-bottom: 4px;">
                  ${loc.name}
                </div>
                <div style="font-size: 12px; color: #4b5563; line-height: 1.4; margin-bottom: 6px;">
                  ${loc.description}
                </div>
                <div style="font-size: 11px; color: #245B3C; font-weight: 600;">
                  Key Crops: ${loc.crops.join(', ')}
                </div>
              </div>
            `);

            new window.maplibregl.Marker({ element: el })
              .setLngLat(loc.coordinates)
              .setPopup(popup)
              .addTo(map);

            el.addEventListener('click', () => {
              setActiveLocation(loc);
            });
          });

          // Allow user to click ANYWHERE on the map to inspect location
          map.on('click', async (e) => {
            const { lng, lat } = e.lngLat;
            let placeName = 'Selected Agricultural Site';
            let detail = 'Lat: ' + lat.toFixed(4) + ', Lng: ' + lng.toFixed(4);

            try {
              const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
              );
              if (res.ok) {
                const data = await res.json();
                placeName =
                  data.address?.city ||
                  data.address?.town ||
                  data.address?.village ||
                  data.address?.county ||
                  data.address?.state ||
                  data.name ||
                  'Custom Location';
                detail = data.display_name;
              }
            } catch (err) {
              // fallback
            }

            dropPinAt([lng, lat], placeName, detail);
          });

          setMapLoaded(true);
        });

        mapInstanceRef.current = map;
      } catch (err) {
        console.error('Map initialization error:', err);
        setMapError('Interactive 3D WebGL map could not be initialized in this browser environment.');
      }
    };

    const timer = setTimeout(initMap, 150);

    return () => {
      clearTimeout(timer);
      if (map) {
        map.remove();
      }
    };
  }, []);

  const reset3DView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo({
        center: activeLocation.coordinates,
        zoom: 10,
        pitch: 62,
        bearing: -20,
        essential: true,
        duration: 1800,
      });
    }
  };

  const toggleTerrainRelief = () => {
    if (mapInstanceRef.current) {
      if (is3DActive) {
        mapInstanceRef.current.setTerrain(null);
        setIs3DActive(false);
      } else {
        mapInstanceRef.current.setTerrain({ source: 'terrain-source', exaggeration: 1.6 });
        setIs3DActive(true);
      }
    }
  };

  const toggleCityLabels = () => {
    if (mapInstanceRef.current) {
      const visibility = showLabels ? 'none' : 'visible';
      if (mapInstanceRef.current.getLayer('satellite-labels-layer')) {
        mapInstanceRef.current.setLayoutProperty('satellite-labels-layer', 'visibility', visibility);
        setShowLabels(!showLabels);
      }
    }
  };

  return (
    <section id="explore-land" className="py-20 md:py-28 bg-[#F8FAF7] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF2E9] text-xs font-semibold tracking-wider text-[#245B3C] uppercase mb-4">
            <MountainIcon className="w-4 h-4 text-[#245B3C]" />
            Geographical Intelligence
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#173D2A] tracking-tight mb-4 font-['Plus_Jakarta_Sans']">
            Explore Agriculture Through a New Perspective
          </h2>
          <p className="text-base sm:text-lg text-[#202820]/75 leading-relaxed">
            Search any city, district, or farmland across Pakistan and the globe. Visualize real terrain elevations, city labels, and agro-climatic zones in high-resolution 3D.
          </p>
        </div>

        {/* Map Container with Modern SaaS Card Shell */}
        <div className="relative rounded-3xl shadow-[0_25px_60px_-15px_rgba(23,61,42,0.15)] border border-emerald-900/10 bg-white">
          {/* Top Bar with Live Search & Map Controls (High z-index to stay above WebGL canvas) */}
          <div className="relative z-40 p-4 sm:px-6 sm:py-3.5 bg-white/98 backdrop-blur-md rounded-t-3xl border-b border-emerald-900/10 flex flex-wrap items-center justify-between gap-3">
            {/* Live Search Input for ANY city/location */}
            <div ref={searchContainerRef} className="relative z-50 flex-1 min-w-[280px] max-w-md">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => {
                    if (searchQuery.trim().length >= 2) setSearchDropdownOpen(true);
                  }}
                  placeholder="Search any location (e.g. Lahore, Faisalabad, Multan, Karachi...)"
                  className="w-full pl-10 pr-4 py-2 bg-emerald-50/50 hover:bg-emerald-50 focus:bg-white text-xs sm:text-sm text-[#173D2A] placeholder-[#202820]/50 rounded-xl border border-emerald-900/15 focus:outline-none focus:ring-2 focus:ring-[#245B3C]/30 focus:border-[#245B3C] transition-all"
                />
                <div className="absolute left-3 text-[#245B3C] pointer-events-none">
                  <MapPinIcon className="w-4 h-4" />
                </div>
                {isSearching && (
                  <div className="absolute right-3 w-4 h-4 border-2 border-[#245B3C] border-t-transparent rounded-full animate-spin" />
                )}
              </div>

              {/* Autocomplete Dropdown - guaranteed above map canvas with high z-index and elevation */}
              {searchDropdownOpen && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-[0_25px_60px_-10px_rgba(23,61,42,0.3)] border border-emerald-900/15 py-2 z-50 max-h-72 overflow-y-auto animate-in fade-in duration-150">
                  <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#245B3C] border-b border-emerald-900/5">
                    Select a Location to Explore
                  </div>
                  {searchResults.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectLocation(item)}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-emerald-50/80 transition-colors flex items-start gap-2.5 cursor-pointer"
                    >
                      <MapPinIcon className="w-4 h-4 text-[#245B3C] mt-0.5 shrink-0" />
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-[#173D2A]">
                          {item.name}
                        </div>
                        <div className="text-[11px] text-[#202820]/60 line-clamp-1">
                          {item.displayName || item.description}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Map Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleCityLabels}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  showLabels
                    ? 'bg-[#245B3C] text-white shadow-xs'
                    : 'bg-[#EAF2E9] text-[#245B3C] hover:bg-emerald-100/70'
                }`}
                title="Toggle city names, roads and regional boundaries"
              >
                <LayersIcon className="w-3.5 h-3.5" />
                {showLabels ? 'City Labels: ON' : 'City Labels: OFF'}
              </button>

              <button
                onClick={reset3DView}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EAF2E9] hover:bg-emerald-100/70 text-[#245B3C] text-xs font-semibold transition-colors cursor-pointer"
                title="Reset 3D camera to default perspective"
              >
                <CompassIcon className="w-3.5 h-3.5" />
                Reset 3D
              </button>

              <button
                onClick={toggleTerrainRelief}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  is3DActive
                    ? 'bg-[#245B3C] text-white shadow-xs'
                    : 'bg-[#EAF2E9] text-[#245B3C] hover:bg-emerald-100/70'
                }`}
                title="Toggle 3D mountain and valley elevation relief"
              >
                <MountainIcon className="w-3.5 h-3.5" />
                {is3DActive ? '3D Relief: ON' : '3D Relief: OFF'}
              </button>
            </div>
          </div>

          {/* Map Canvas / Fallback Area (z-10 layer with rounded bottom corners) */}
          <div className="relative z-10 w-full h-[540px] sm:h-[620px] lg:h-[680px] bg-[#173D2A]/5 rounded-b-3xl overflow-hidden">
            {mapError ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-emerald-50/40">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#245B3C] mb-4">
                  <MountainIcon className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-[#173D2A] mb-2">3D Map Initialization</h4>
                <p className="text-sm text-[#202820]/75 max-w-md mb-4 leading-relaxed">{mapError}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 rounded-xl bg-[#245B3C] text-white text-xs font-semibold hover:bg-[#173D2A] transition-colors"
                >
                  Reload 3D Map
                </button>
              </div>
            ) : (
              <div ref={mapContainerRef} className="w-full h-full" />
            )}

            {/* Quick Agricultural Location Chips at bottom */}
            <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 max-w-4xl pointer-events-auto">
              <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-lg border border-emerald-900/10">
                <div className="text-xs font-bold uppercase tracking-wider text-[#245B3C] mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <MapPinIcon className="w-3.5 h-3.5 text-[#245B3C]" />
                    <span>Quick Select Major Agricultural Hubs & Cities</span>
                  </div>
                  <span className="text-[11px] text-[#202820]/60 font-normal hidden sm:inline">
                    Click anywhere on the map or type in search above
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                  {PRESET_LOCATIONS.map((loc) => (
                    <button
                      key={loc.name}
                      onClick={() => handleSelectLocation(loc)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all duration-150 cursor-pointer ${
                        activeLocation?.name === loc.name
                          ? 'bg-[#245B3C] text-white shadow-xs'
                          : 'bg-[#EAF2E9] text-[#173D2A] hover:bg-emerald-100'
                      }`}
                    >
                      {loc.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
