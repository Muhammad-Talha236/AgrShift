import os, glob, csv, json, datetime

RAW_DIR = 'd:/Uni projects/AgrShift/dataset/raw'
PROCESSED_DIR = 'd:/Uni projects/AgrShift/dataset/processed'
os.makedirs(PROCESSED_DIR, exist_ok=True)

# Standardized Application Crop Mappings
CROP_MAPPINGS = {
    'Wheat': {
        'id': 'wheat',
        'display_name': 'Wheat',
        'scientific_name': 'Triticum aestivum',
        'category': 'Cereal / Rabi Grain',
        'rotation_role': 'Baseline Cereal / High Starch Staple'
    },
    'Wetland rice': {
        'id': 'rice',
        'display_name': 'Rice',
        'scientific_name': 'Oryza sativa',
        'category': 'Cereal / Kharif Grain',
        'rotation_role': 'Baseline Flooded Cereal / Summer Staple'
    },
    'Maize': {
        'id': 'maize',
        'display_name': 'Maize (Corn)',
        'scientific_name': 'Zea mays',
        'category': 'C4 Cereal / Summer Grain',
        'rotation_role': 'High-Biomass Feeder / Feed & Food Grain'
    },
    'Soybean': {
        'id': 'soybean',
        'display_name': 'Soybean',
        'scientific_name': 'Glycine max',
        'category': 'Legume / Oilseed',
        'rotation_role': 'Biological Nitrogen Fixer / Soil Restoration'
    },
    'Cotton': {
        'id': 'cotton',
        'display_name': 'Cotton',
        'scientific_name': 'Gossypium hirsutum',
        'category': 'Fiber / Cash Crop',
        'rotation_role': 'Commercial Cash Crop / Deep Taproot Soil Aeration'
    },
    'Sugar cane': {
        'id': 'sugarcane',
        'display_name': 'Sugarcane',
        'scientific_name': 'Saccharum officinarum',
        'category': 'Sugar / Perennial Grass',
        'rotation_role': 'High-Biomass Semi-Perennial / Industrial Cash Crop'
    },
    'Sorghum': {
        'id': 'sorghum',
        'display_name': 'Sorghum',
        'scientific_name': 'Sorghum bicolor',
        'category': 'C4 Drought Cereal',
        'rotation_role': 'Water Resilience / Arid Climate Adaptation'
    },
    'White potato': {
        'id': 'potato',
        'display_name': 'Potato',
        'scientific_name': 'Solanum tuberosum',
        'category': 'Root & Tuber',
        'rotation_role': 'Tuber Pan-Breaker / Potassium Nutrient Cycling'
    }
}

# Standardized Water Input Mappings
WIP_MAPPINGS = {
    'Irrigation and high input level of management': 'irrigated_high',
    'Rain fed and high input level of management': 'rainfed_high',
    'Rain fed and low input level of management': 'rainfed_low',
    'Irrigation and low input level of management': 'irrigated_low'
}

# Numeric fields with their respective units
FIELD_METADATA = {
    'extents_total_1000ha': {'source_col': 'EXTENTS', 'unit': '10^3 ha', 'type': 'float'},
    'suitability_very_suitable_1000ha': {'source_col': 'SUIT_VS', 'unit': '10^3 ha', 'type': 'float'},
    'suitability_suitable_1000ha': {'source_col': 'SUIT_S', 'unit': '10^3 ha', 'type': 'float'},
    'suitability_moderately_suitable_1000ha': {'source_col': 'SUIT_MS', 'unit': '10^3 ha', 'type': 'float'},
    'suitability_marginally_suitable_1000ha': {'source_col': 'SUIT_mS_', 'unit': '10^3 ha', 'type': 'float'},
    'suitability_very_marginally_suitable_1000ha': {'source_col': 'SUIT_vmS_', 'unit': '10^3 ha', 'type': 'float'},
    'suitability_not_suitable_1000ha': {'source_col': 'SUIT_NS', 'unit': '10^3 ha', 'type': 'float'},
    'production_very_suitable_1000tons': {'source_col': 'PROD_VS', 'unit': '10^3 tons', 'type': 'float'},
    'production_suitable_1000tons': {'source_col': 'PROD_S', 'unit': '10^3 tons', 'type': 'float'},
    'production_moderately_suitable_1000tons': {'source_col': 'PROD_MS', 'unit': '10^3 tons', 'type': 'float'},
    'production_marginally_suitable_1000tons': {'source_col': 'PROD_mS_', 'unit': '10^3 tons', 'type': 'float'},
    'production_very_marginally_suitable_1000tons': {'source_col': 'PROD_vmS_', 'unit': '10^3 tons', 'type': 'float'},
    'yield_maximum_kg_per_ha': {'source_col': 'Ymax', 'unit': 'kg/ha', 'type': 'float'},
    'yield_very_suitable_kg_per_ha': {'source_col': 'Y_VS', 'unit': 'kg/ha', 'type': 'float'},
    'yield_suitable_kg_per_ha': {'source_col': 'Y_S', 'unit': 'kg/ha', 'type': 'float'},
    'yield_moderately_suitable_kg_per_ha': {'source_col': 'Y_MS', 'unit': 'kg/ha', 'type': 'float'},
    'yield_marginally_suitable_kg_per_ha': {'source_col': 'Y_mS_', 'unit': 'kg/ha', 'type': 'float'},
    'yield_very_marginally_suitable_kg_per_ha': {'source_col': 'Y_vmS_', 'unit': 'kg/ha', 'type': 'float'}
}

AREA_SOURCE_COLUMNS = {
    'EXTENTS', 'SUIT_VS', 'SUIT_S', 'SUIT_MS', 'SUIT_mS_', 'SUIT_vmS_', 'SUIT_NS'
}

def km2_to_1000ha(value):
    return None if value is None else value * 0.1

def solar_mj_to_kwh_series(values):
    return {period: None if value is None else value / 3.6
            for period, value in values.items()}

def parse_float_or_null(val_str):
    if val_str is None or val_str.strip() == '':
        return None
    try:
        return float(val_str.strip())
    except ValueError:
        return None

def normalize_gaez_datasets():
    csv_files = sorted(glob.glob(os.path.join(RAW_DIR, 'gaez_*.csv')))
    print(f"Normalizing {len(csv_files)} GAEZ raw CSV files...")
    
    normalized_records = []
    
    for fpath in csv_files:
        fname = os.path.basename(fpath)
        with open(fpath, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for r_idx, row in enumerate(reader, 1):
                raw_crop = row.get('Crop', '').strip()
                crop_meta = CROP_MAPPINGS.get(raw_crop, {
                    'id': raw_crop.lower().replace(' ', '_'),
                    'display_name': raw_crop,
                    'scientific_name': 'Unknown',
                    'category': 'Other',
                    'rotation_role': 'Unspecified'
                })
                
                raw_wip = row.get('water_input', '').strip()
                normalized_wip = WIP_MAPPINGS.get(raw_wip, raw_wip)
                
                iso3 = row.get('iso3', '').strip().upper()
                country = row.get('country', '').strip()
                
                rec = {
                    'provenance': {
                        'source_dataset': 'FAO/IIASA GAEZ v5',
                        'theme': 'Theme 3: Suitability and Attainable Yield',
                        'raw_file': fname,
                        'raw_row_index': r_idx
                    },
                    'dimensions': {
                        'crop_id': crop_meta['id'],
                        'crop_display_name': crop_meta['display_name'],
                        'crop_scientific_name': crop_meta['scientific_name'],
                        'crop_category': crop_meta['category'],
                        'rotation_role': crop_meta['rotation_role'],
                        'iso3': iso3,
                        'country_name': country,
                        'water_management': normalized_wip,
                        'water_management_raw': raw_wip,
                        'climate_source': row.get('climate_data_source', '').strip(),
                        'climate_scenario': row.get('ssp', '').strip(),
                        'time_period': row.get('time_period', '').strip(),
                        'land_cover': row.get('LC', '').strip(),
                        'exclusion_class': row.get('EXC', '').strip(),
                        'agro_ecological_zone': row.get('AEZ', '').strip(),
                        'geographic_level': row.get('geographic_level', '').strip()
                    },
                    'agronomics': {}
                }
                
                for norm_key, meta in FIELD_METADATA.items():
                    raw_val = row.get(meta['source_col'], '')
                    parsed_val = parse_float_or_null(raw_val)
                    if meta['source_col'] in AREA_SOURCE_COLUMNS:
                        parsed_val = km2_to_1000ha(parsed_val)
                    rec['agronomics'][norm_key] = parsed_val
                    
                normalized_records.append(rec)
                
    print(f"Total normalized GAEZ records: {len(normalized_records)}")
    
    # Save normalized JSON
    json_out = os.path.join(PROCESSED_DIR, 'gaez_crop_suitability_normalized.json')
    with open(json_out, 'w', encoding='utf-8') as f:
        json.dump(normalized_records, f, indent=2)
    print(f"Saved: {json_out} ({os.path.getsize(json_out):,} bytes)")
    
    # Save normalized flat CSV for easy inspection / dataframes
    csv_out = os.path.join(PROCESSED_DIR, 'gaez_crop_suitability_normalized.csv')
    flat_fieldnames = [
        'source_file', 'crop_id', 'crop_name', 'iso3', 'country_name',
        'water_management', 'climate_source', 'scenario', 'time_period',
        'land_cover', 'exclusion', 'aez', 'extents_1000ha',
        'suit_vs_1000ha', 'suit_s_1000ha', 'suit_ms_1000ha', 'suit_ms_low_1000ha',
        'suit_vms_1000ha', 'suit_ns_1000ha', 'prod_vs_1000tons', 'prod_s_1000tons',
        'prod_ms_1000tons', 'prod_ms_low_1000tons', 'prod_vms_1000tons',
        'yield_max_kg_ha', 'yield_vs_kg_ha', 'yield_s_kg_ha', 'yield_ms_kg_ha',
        'yield_ms_low_kg_ha', 'yield_vms_kg_ha'
    ]
    with open(csv_out, 'w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(flat_fieldnames)
        for r in normalized_records:
            d = r['dimensions']
            a = r['agronomics']
            writer.writerow([
                r['provenance']['raw_file'],
                d['crop_id'],
                d['crop_display_name'],
                d['iso3'],
                d['country_name'],
                d['water_management'],
                d['climate_source'],
                d['climate_scenario'],
                d['time_period'],
                d['land_cover'],
                d['exclusion_class'],
                d['agro_ecological_zone'],
                a['extents_total_1000ha'],
                a['suitability_very_suitable_1000ha'],
                a['suitability_suitable_1000ha'],
                a['suitability_moderately_suitable_1000ha'],
                a['suitability_marginally_suitable_1000ha'],
                a['suitability_very_marginally_suitable_1000ha'],
                a['suitability_not_suitable_1000ha'],
                a['production_very_suitable_1000tons'],
                a['production_suitable_1000tons'],
                a['production_moderately_suitable_1000tons'],
                a['production_marginally_suitable_1000tons'],
                a['production_very_marginally_suitable_1000tons'],
                a['yield_maximum_kg_per_ha'],
                a['yield_very_suitable_kg_per_ha'],
                a['yield_suitable_kg_per_ha'],
                a['yield_moderately_suitable_kg_per_ha'],
                a['yield_marginally_suitable_kg_per_ha'],
                a['yield_very_marginally_suitable_kg_per_ha']
            ])
    print(f"Saved: {csv_out} ({os.path.getsize(csv_out):,} bytes)")
    return normalized_records

def normalize_nasa_power_datasets():
    power_files = sorted(glob.glob(os.path.join(RAW_DIR, 'nasa_power', '*.json')))
    print(f"\nNormalizing {len(power_files)} NASA POWER JSON files...")
    
    normalized_profiles = []
    
    for fpath in power_files:
        fname = os.path.basename(fpath)
        with open(fpath, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        geom = data.get('geometry', {}).get('coordinates', [])
        params = data.get('properties', {}).get('parameter', {})
        header = data.get('header', {})
        
        # Determine archetype from filename
        archetype = fname.replace('nasa_power_climatology_', '').replace('.json', '')
        solar_kwh = solar_mj_to_kwh_series(params.get('ALLSKY_SFC_SW_DWN', {}))
        
        profile = {
            'provenance': {
                'source': 'NASA POWER API (LaRC)',
                'community': 'AG (Agroclimatology)',
                'temporal_resolution': 'Climatology (Multi-Year Monthly Average)',
                'raw_file': fname
            },
            'location': {
                'archetype_id': archetype,
                'longitude': geom[0] if len(geom) > 0 else None,
                'latitude': geom[1] if len(geom) > 1 else None,
                'elevation_meters': geom[2] if len(geom) > 2 else None
            },
            'parameters': {
                'temperature_mean_c': params.get('T2M', {}),
                'temperature_max_c': params.get('T2M_MAX', {}),
                'temperature_min_c': params.get('T2M_MIN', {}),
                'precipitation_corrected_mm_day': params.get('PRECTOTCORR', {}),
                'solar_radiation_surface_downward_kwh_m2_day': solar_kwh,
                'relative_humidity_2m_percent': params.get('RH2M', {})
            },
            'annual_summary': {
                'mean_temperature_c': params.get('T2M', {}).get('ANN'),
                'max_temperature_c': params.get('T2M_MAX', {}).get('ANN'),
                'min_temperature_c': params.get('T2M_MIN', {}).get('ANN'),
                'mean_precipitation_mm_day': params.get('PRECTOTCORR', {}).get('ANN'),
                'annual_precipitation_estimate_mm_year': round(params.get('PRECTOTCORR', {}).get('ANN', 0) * 365.25, 1) if params.get('PRECTOTCORR', {}).get('ANN') else None,
                'mean_solar_radiation_kwh_m2_day': solar_kwh.get('ANN'),
                'mean_relative_humidity_percent': params.get('RH2M', {}).get('ANN')
            }
        }
        normalized_profiles.append(profile)
        
    out_path = os.path.join(PROCESSED_DIR, 'nasa_power_climatology_normalized.json')
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(normalized_profiles, f, indent=2)
    print(f"Saved: {out_path} ({os.path.getsize(out_path):,} bytes)")
    return normalized_profiles

if __name__ == '__main__':
    print(f"AgriShift Normalization Pipeline started at: {datetime.datetime.now().isoformat()}")
    gaez_recs = normalize_gaez_datasets()
    power_recs = normalize_nasa_power_datasets()
    print("\nNormalization Pipeline Complete!")
    print(f"Total GAEZ records normalized: {len(gaez_recs)}")
    print(f"Total NASA POWER profiles normalized: {len(power_recs)}")
