import { CountyAPI, APILog, PerformanceMetric } from '../types';

export const INITIAL_COUNTIES: CountyAPI[] = [
  {
    id: 'la-ca',
    name: 'Los Angeles County',
    state: 'CA',
    population: 9829544,
    apiStatus: 'active',
    endpointUrl: 'https://api.lacounty.gov/v2/stats/demographics',
    lastSynced: '2026-06-16T10:05:00Z',
    syncFrequency: 'Hourly',
    mappedFieldsCount: 24,
    latencyMs: 145,
    data: {
      budgetAllocated: 38500000000,
      activePermits: 12450,
      transitFactor: 8.4,
      healthScore: 78,
      crimeRateIndex: 64,
    },
  },
  {
    id: 'cook-il',
    name: 'Cook County',
    state: 'IL',
    population: 5108212,
    apiStatus: 'active',
    endpointUrl: 'https://data.cookcountyil.gov/api/v1/permits/active',
    lastSynced: '2026-06-16T09:47:00Z',
    syncFrequency: 'Hourly',
    mappedFieldsCount: 18,
    latencyMs: 210,
    data: {
      budgetAllocated: 6900000000,
      activePermits: 8430,
      transitFactor: 7.9,
      healthScore: 71,
      crimeRateIndex: 72,
    },
  },
  {
    id: 'harris-tx',
    name: 'Harris County',
    state: 'TX',
    population: 4728030,
    apiStatus: 'active',
    endpointUrl: 'https://api.harriscountytx.gov/infrastructure/transit/load',
    lastSynced: '2026-06-16T10:00:00Z',
    syncFrequency: 'Daily',
    mappedFieldsCount: 15,
    latencyMs: 185,
    data: {
      budgetAllocated: 2400000000,
      activePermits: 9780,
      transitFactor: 5.6,
      healthScore: 74,
      crimeRateIndex: 59,
    },
  },
  {
    id: 'maricopa-az',
    name: 'Maricopa County',
    state: 'AZ',
    population: 4420568,
    apiStatus: 'active',
    endpointUrl: 'https://api.maricopa.gov/v1/planning/zoning',
    lastSynced: '2026-06-16T09:15:00Z',
    syncFrequency: 'Daily',
    mappedFieldsCount: 12,
    latencyMs: 128,
    data: {
      budgetAllocated: 3100000000,
      activePermits: 14210,
      transitFactor: 4.8,
      healthScore: 82,
      crimeRateIndex: 45,
    },
  },
  {
    id: 'sd-ca',
    name: 'San Diego County',
    state: 'CA',
    population: 3298634,
    apiStatus: 'active',
    endpointUrl: 'https://api.sandiegocounty.gov/v3/publichealth/vital',
    lastSynced: '2026-06-16T08:30:00Z',
    syncFrequency: 'Daily',
    mappedFieldsCount: 20,
    latencyMs: 165,
    data: {
      budgetAllocated: 7200000000,
      activePermits: 6220,
      transitFactor: 6.8,
      healthScore: 85,
      crimeRateIndex: 38,
    },
  },
  {
    id: 'miami-fl',
    name: 'Miami-Dade County',
    state: 'FL',
    population: 2701767,
    apiStatus: 'active',
    endpointUrl: 'https://api.miamidade.gov/resilience/sealevel/realtime',
    lastSynced: '2026-06-16T10:02:00Z',
    syncFrequency: 'Hourly',
    mappedFieldsCount: 32,
    latencyMs: 245,
    data: {
      budgetAllocated: 9000000000,
      activePermits: 11150,
      transitFactor: 6.2,
      healthScore: 76,
      crimeRateIndex: 52,
    },
  },
  {
    id: 'fulton-ga',
    name: 'Fulton County',
    state: 'GA',
    population: 1066710,
    apiStatus: 'pending',
    endpointUrl: 'https://api.fultoncountyga.gov/finance/ledger/exports',
    lastSynced: '从未 (Never)',
    syncFrequency: 'Weekly',
    mappedFieldsCount: 0,
    latencyMs: 0,
    data: {
      budgetAllocated: 0,
      activePermits: 0,
      transitFactor: 0,
      healthScore: 0,
      crimeRateIndex: 0,
    },
  },
  {
    id: 'wayne-mi',
    name: 'Wayne County',
    state: 'MI',
    population: 1793561,
    apiStatus: 'failed',
    endpointUrl: 'https://api.waynecounty.com/v1/elections/live-update',
    lastSynced: '2026-06-15T15:20:00Z',
    syncFrequency: 'Hourly',
    mappedFieldsCount: 14,
    latencyMs: 1500, // Timeout trigger
    data: {
      budgetAllocated: 1800000000,
      activePermits: 3100,
      transitFactor: 5.1,
      healthScore: 62,
      crimeRateIndex: 78,
    },
  },
];

export const INITIAL_LOGS: APILog[] = [
  {
    id: 'log-1',
    countyName: 'Los Angeles County',
    state: 'CA',
    timestamp: '2026-06-16T10:05:00Z',
    status: '200 OK',
    latency: 145,
    endpoint: 'https://api.lacounty.gov/v2/stats/demographics',
    type: 'Automatic Cron',
  },
  {
    id: 'log-2',
    countyName: 'Miami-Dade County',
    state: 'FL',
    timestamp: '2026-06-16T10:02:00Z',
    status: '200 OK',
    latency: 245,
    endpoint: 'https://api.miamidade.gov/resilience/sealevel/realtime',
    type: 'Automatic Cron',
  },
  {
    id: 'log-3',
    countyName: 'Harris County',
    state: 'TX',
    timestamp: '2026-06-16T10:00:00Z',
    status: '200 OK',
    latency: 185,
    endpoint: 'https://api.harriscountytx.gov/infrastructure/transit/load',
    type: 'Automatic Cron',
  },
  {
    id: 'log-4',
    countyName: 'Wayne County',
    state: 'MI',
    timestamp: '2026-06-15T15:20:00Z',
    status: '503 Service Unavailable',
    latency: 1500,
    endpoint: 'https://api.waynecounty.com/v1/elections/live-update',
    type: 'Automatic Cron',
  },
  {
    id: 'log-5',
    countyName: 'Cook County',
    state: 'IL',
    timestamp: '2026-06-16T09:47:00Z',
    status: '200 OK',
    latency: 210,
    endpoint: 'https://data.cookcountyil.gov/api/v1/permits/active',
    type: 'Automatic Cron',
  },
];

export const HISTORICAL_CHART_DATA: PerformanceMetric[] = [
  { date: '06/10', totalCalls: 12400, successfulCalls: 12210, averageLatencyMs: 195 },
  { date: '06/11', totalCalls: 13150, successfulCalls: 12900, averageLatencyMs: 188 },
  { date: '06/12', totalCalls: 14200, successfulCalls: 13950, averageLatencyMs: 202 },
  { date: '06/13', totalCalls: 15300, successfulCalls: 15120, averageLatencyMs: 175 },
  { date: '06/14', totalCalls: 16800, successfulCalls: 16400, averageLatencyMs: 182 },
  { date: '06/15', totalCalls: 17100, successfulCalls: 16750, averageLatencyMs: 191 },
  { date: '06/16', totalCalls: 18250, successfulCalls: 18180, averageLatencyMs: 168 },
];

export function getMappableFieldsTemplate() {
  return [
    { key: 'budget_allocated', type: 'float', desc: 'Annual budget allocated code' },
    { key: 'active_building_permits', type: 'integer', desc: 'Active construction or zoning projects' },
    { key: 'public_transit_factor', type: 'float', desc: 'Standard score for congestion / mobility index' },
    { key: 'healthcare_safety_score', type: 'integer', desc: 'County public safety vital index rating' },
    { key: 'safety_index', type: 'integer', desc: 'Local FBI crime index metric score' },
  ];
}

export function simulateFetchingCounty(county: CountyAPI): Promise<{
  original: CountyAPI;
  rawJson: string;
  simulatedTime: string;
  statusCode: string;
  latency: number;
}> {
  return new Promise((resolve) => {
    const latency = Math.floor(Math.random() * 120) + 80; // 80 - 200 ms latency
    setTimeout(() => {
      let statusCode = '200 OK';
      if (county.apiStatus === 'failed') {
        statusCode = '503 Service Unavailable';
      }

      // Add a slight randomization to budget/permits to simulate live telemetry changes
      const randomMultiplier = 0.95 + Math.random() * 0.1; // +/- 5% variation
      const simulatedData = {
        county_metadata: {
          county_name: county.name,
          state_code: county.state,
          census_population_2026: county.population,
          api_endpoint_invoked: county.endpointUrl,
          latency_measured_ms: latency,
          response_timestamp: new Date().toISOString(),
        },
        payload_status: statusCode,
        mapped_demographics: {
          annual_fiscal_budget: county.apiStatus === 'pending' ? 0 : Math.round(county.data.budgetAllocated * randomMultiplier),
          zoning_active_permits: county.apiStatus === 'pending' ? 0 : Math.round(county.data.activePermits * randomMultiplier),
          transit_factor_score: county.apiStatus === 'pending' ? 0.0 : parseFloat((county.data.transitFactor * randomMultiplier).toFixed(2)),
          general_healthcare_score: county.apiStatus === 'pending' ? 0 : Math.round(county.data.healthScore * randomMultiplier),
          safety_index_metric: county.apiStatus === 'pending' ? 0 : Math.round(county.data.crimeRateIndex * randomMultiplier),
        },
      };

      resolve({
        original: county,
        rawJson: JSON.stringify(simulatedData, null, 2),
        simulatedTime: new Date().toLocaleTimeString(),
        statusCode,
        latency,
      });
    }, 700); // UI delay feedback
  });
}
