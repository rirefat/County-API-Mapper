export interface CountyAPI {
  id: string;
  name: string;
  state: string;
  population: number;
  apiStatus: 'active' | 'pending' | 'failed';
  endpointUrl: string;
  lastSynced: string;
  syncFrequency: string; // "Hourly", "Daily", "Weekly"
  mappedFieldsCount: number;
  latencyMs: number;
  data: {
    budgetAllocated: number;
    activePermits: number;
    transitFactor: number;
    healthScore: number;
    crimeRateIndex: number;
  };
}

export interface APILog {
  id: string;
  countyName: string;
  state: string;
  timestamp: string;
  status: '200 OK' | '503 Service Unavailable' | '404 Not Found' | '401 Unauthorized';
  latency: number;
  endpoint: string;
  type: 'Automatic Cron' | 'Manual Sandbox Call';
}

export interface PerformanceMetric {
  date: string;
  totalCalls: number;
  successfulCalls: number;
  averageLatencyMs: number;
}
