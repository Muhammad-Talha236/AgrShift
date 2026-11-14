"""Focused, offline unit-conversion tests for the dataset normalizer."""

import csv
import importlib.util
import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch


SCRIPT_PATH = Path(__file__).with_name('normalize_datasets.py')


class NormalizeUnitsTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # The legacy module creates its configured output directory on import.
        # Suppress that side effect; each test supplies an isolated temp directory.
        spec = importlib.util.spec_from_file_location('normalize_datasets', SCRIPT_PATH)
        cls.normalizer = importlib.util.module_from_spec(spec)
        with patch('os.makedirs'):
            spec.loader.exec_module(cls.normalizer)

    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp_dir.cleanup)
        root = Path(self.temp_dir.name)
        self.raw = root / 'raw'
        self.processed = root / 'processed'
        self.raw.mkdir()
        self.processed.mkdir()
        self.normalizer.RAW_DIR = str(self.raw)
        self.normalizer.PROCESSED_DIR = str(self.processed)

    def test_gaez_area_fields_and_coverage_ratio(self):
        area_values = {
            'EXTENTS': '100', 'SUIT_VS': '10', 'SUIT_S': '20',
            'SUIT_MS': '30', 'SUIT_mS_': '5', 'SUIT_vmS_': '0',
            'SUIT_NS': '',
        }
        row = {
            'Crop': 'Wheat', 'iso3': 'PAK', 'country': 'Pakistan',
            'water_input': 'Rain fed and high input level of management',
            'PROD_VS': '12.5', 'Ymax': '9000', **area_values,
        }
        source = self.raw / 'gaez_wheat_rainfed_historical.csv'
        with source.open('w', newline='', encoding='utf-8') as handle:
            writer = csv.DictWriter(handle, fieldnames=row.keys())
            writer.writeheader()
            writer.writerow(row)

        records = self.normalizer.normalize_gaez_datasets()
        self.assertEqual(len(records), 1)
        agronomics = records[0]['agronomics']
        self.assertEqual(
            {metadata['source_col'] for metadata in self.normalizer.FIELD_METADATA.values()
             if metadata['source_col'] in self.normalizer.AREA_SOURCE_COLUMNS},
            set(area_values),
        )
        for name, metadata in self.normalizer.FIELD_METADATA.items():
            if metadata['source_col'] in area_values:
                raw = area_values[metadata['source_col']]
                if raw == '':
                    self.assertIsNone(agronomics[name], name)
                else:
                    self.assertAlmostEqual(agronomics[name], float(raw) * 0.1, msg=name)

        self.assertEqual(agronomics['suitability_very_marginally_suitable_1000ha'], 0)
        self.assertEqual(agronomics['production_very_suitable_1000tons'], 12.5)
        self.assertEqual(agronomics['yield_maximum_kg_per_ha'], 9000)
        source_ratio = (10 + 20 + 30) / 100
        normalized_ratio = sum(agronomics[key] for key in (
            'suitability_very_suitable_1000ha',
            'suitability_suitable_1000ha',
            'suitability_moderately_suitable_1000ha',
        )) / agronomics['extents_total_1000ha']
        self.assertAlmostEqual(normalized_ratio, source_ratio)

        saved = json.loads((self.processed / 'gaez_crop_suitability_normalized.json').read_text(encoding='utf-8'))
        self.assertEqual(saved, records)
        with (self.processed / 'gaez_crop_suitability_normalized.csv').open(newline='', encoding='utf-8') as handle:
            flat = next(csv.DictReader(handle))
        self.assertEqual(float(flat['extents_1000ha']), 10)
        self.assertEqual(float(flat['suit_vs_1000ha']), 1)
        self.assertEqual(flat['suit_ns_1000ha'], '')
        self.assertEqual(float(flat['prod_vs_1000tons']), 12.5)

    def test_nasa_solar_monthly_and_annual_only(self):
        nasa_dir = self.raw / 'nasa_power'
        nasa_dir.mkdir()
        solar = {'JAN': 3.6, 'FEB': 0, 'MAR': None, 'ANN': 7.2}
        parameters = {
            'ALLSKY_SFC_SW_DWN': solar,
            'T2M': {'JAN': 25, 'ANN': 26},
            'T2M_MAX': {'ANN': 39},
            'T2M_MIN': {'ANN': 12},
            'PRECTOTCORR': {'JAN': 1, 'ANN': 2},
            'RH2M': {'ANN': 55},
        }
        raw = {'geometry': {'coordinates': [74.3, 31.5, 200]},
               'properties': {'parameter': parameters}}
        (nasa_dir / 'nasa_power_climatology_test.json').write_text(json.dumps(raw), encoding='utf-8')

        profiles = self.normalizer.normalize_nasa_power_datasets()
        self.assertEqual(len(profiles), 1)
        profile = profiles[0]
        converted = profile['parameters']['solar_radiation_surface_downward_kwh_m2_day']
        self.assertEqual(converted, {'JAN': 1.0, 'FEB': 0.0, 'MAR': None, 'ANN': 2.0})
        self.assertEqual(profile['annual_summary']['mean_solar_radiation_kwh_m2_day'], 2.0)
        self.assertEqual(profile['parameters']['temperature_mean_c'], parameters['T2M'])
        self.assertEqual(profile['parameters']['precipitation_corrected_mm_day'], parameters['PRECTOTCORR'])
        self.assertEqual(profile['parameters']['relative_humidity_2m_percent'], parameters['RH2M'])
        self.assertEqual(profile['annual_summary']['annual_precipitation_estimate_mm_year'], 730.5)
        saved = json.loads((self.processed / 'nasa_power_climatology_normalized.json').read_text(encoding='utf-8'))
        self.assertEqual(saved, profiles)


if __name__ == '__main__':
    unittest.main()
