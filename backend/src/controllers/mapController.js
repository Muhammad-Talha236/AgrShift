/**
 * AgriShift — Map Configuration Controller
 * Serves public 3D terrain and satellite configuration without exposing sensitive tokens.
 */

exports.getMapConfig = (req, res) => {
  const mapConfig = {
    provider: 'maplibre-gl',
    initialView: {
      center: [74.3587, 31.5204], // Indus Basin Agricultural Heartland
      zoom: 10.5,
      pitch: 62, // 3D perspective pitch
      bearing: -24, // 3D rotation
      maxPitch: 85,
    },
    terrain: {
      source: 'aws-terrarium-dem',
      type: 'raster-dem',
      tiles: ['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'],
      encoding: 'terrarium',
      tileSize: 256,
      maxzoom: 15,
      exaggeration: 1.6, // Realistic mountain & valley relief
    },
    baseLayers: [
      {
        id: 'esri-satellite',
        name: 'High-Resolution Satellite Imagery',
        type: 'raster',
        tiles: [
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        ],
        tileSize: 256,
        attribution: 'Tiles &copy; Esri, Maxar, Earthstar Geographics, USDA FSA, USGS, Aerogrid, IGN, IGP',
        maxzoom: 19,
      },
      {
        id: 'osm-carto',
        name: 'Topographic Field Map',
        type: 'raster',
        tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
        tileSize: 256,
        attribution: '&copy; OpenStreetMap contributors',
        maxzoom: 19,
      },
    ],
    markers: [
      {
        id: 'indus_basin',
        title: 'Indus Basin Agricultural Plains',
        region: 'Punjab, Pakistan',
        coordinates: [74.3587, 31.5204],
        crops: ['Wheat', 'Rice', 'Sugarcane', 'Cotton'],
        elevationMeters: 217,
        description: 'World’s largest contiguous canal irrigation network feeding fertile alluvial croplands.',
      },
      {
        id: 'nile_delta',
        title: 'Nile Delta Cropland Belt',
        region: 'Lower Egypt',
        coordinates: [31.5085, 30.5852],
        crops: ['Cotton', 'Rice', 'Wheat', 'Maize'],
        elevationMeters: 14,
        description: 'Centuries of silt-rich river deposition sustaining intensive agricultural cycles.',
      },
      {
        id: 'corn_belt',
        title: 'Midwestern Corn Belt',
        region: 'Iowa, United States',
        coordinates: [-93.6208, 41.5868],
        crops: ['Maize', 'Soybean'],
        elevationMeters: 290,
        description: 'Prime agricultural mollisols supporting high-yield mechanized grain farming.',
      },
      {
        id: 'rift_valley',
        title: 'Great Rift Valley Highlands',
        region: 'Nakuru, Kenya',
        coordinates: [36.08, -0.303],
        crops: ['Maize', 'Wheat', 'Sorghum'],
        elevationMeters: 1850,
        description: 'Volcanic highland soils characterized by bimodal rainfall and complex microclimates.',
      },
      {
        id: 'cerrado_basin',
        title: 'Brazilian Cerrado Savanna Croplands',
        region: 'Mato Grosso, Brazil',
        coordinates: [-55.72, -12.68],
        crops: ['Soybean', 'Cotton', 'Maize'],
        elevationMeters: 410,
        description: 'Vast tropical savanna transformed through soil correction into a global agricultural breadbasket.',
      },
    ],
  };

  res.status(200).json({
    success: true,
    data: mapConfig,
  });
};
