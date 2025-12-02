import type { PaginatedParams } from "../../types/Paginated";

/**
 * GET rewards
 */
export interface GetRewardParams extends PaginatedParams {}

/**
 * POST reward
 */
export interface CreateRewardBody {
  name: string;
  cost: number;
}

/**
 * GET metrics
 */
export interface RewardsMetricsResponse {
  totalRewards: number;
  totalCost: number;
  averageCost: number;
  createdLast30Days: number;
}

