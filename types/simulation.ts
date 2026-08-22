// types/simulation.ts

export interface SimulationEconomyConfig {
  tax_rate: number;
  platform_fee: number;
  default_donation_percent: number;
}

export interface SimulationEngagementConfig {
  base_post_rate_per_user_per_day: number;
  response_probability: number;
}

export interface SimulationConfig {
  seed: number;
  start_tick: number;
  population_fixed: boolean;
  initial_population: number;
  spawn_rate_per_day: number;
  tick_per_day: number;
  economy: SimulationEconomyConfig;
  engagement: SimulationEngagementConfig;
}

export interface EcosystemKPIs {
    currentDate: string;
    totalEcosystemValue: number;
    totalTransactions: number;
    communityPoolCapital: number;
    activeUsers: number;
    gdp: number;
}

export interface SimulationEvent {
    id: string;
    timestamp: string;
    description: string;
    category: 'Market' | 'User' | 'System' | 'Social';
}