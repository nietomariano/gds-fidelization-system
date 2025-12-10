import { httpClient } from "../../http"
import { Service } from "../../http/Service"
import type { SuccessResponse } from "../../types/Response"
import type {
  GetDashboardStatsResponse,
  GetPointsChartResponse,
  GetRewardsChartResponse,
  GetRecentActivityResponse,
  GetTopCustomersResponse,
} from "./dashboard.types"

export class DashboardService extends Service {
  constructor() {
    super(httpClient, "/business/dashboard")
  }

  /**
   * Get dashboard statistics
   */
  async getStats(): Promise<SuccessResponse<GetDashboardStatsResponse>> {
    return this.client.get<SuccessResponse<GetDashboardStatsResponse>>(
      `${this.resource}/stats`
    )
  }

  /**
   * Get points chart data (last 30 days)
   */
  async getPointsChart(): Promise<SuccessResponse<GetPointsChartResponse>> {
    return this.client.get<SuccessResponse<GetPointsChartResponse>>(
      `${this.resource}/points-chart`
    )
  }

  /**
   * Get rewards chart data (top 5)
   */
  async getRewardsChart(): Promise<SuccessResponse<GetRewardsChartResponse>> {
    return this.client.get<SuccessResponse<GetRewardsChartResponse>>(
      `${this.resource}/rewards-chart`
    )
  }

  /**
   * Get recent activity
   */
  async getRecentActivity(): Promise<SuccessResponse<GetRecentActivityResponse>> {
    return this.client.get<SuccessResponse<GetRecentActivityResponse>>(
      `${this.resource}/recent-activity`
    )
  }

  /**
   * Get top customers
   */
  async getTopCustomers(): Promise<SuccessResponse<GetTopCustomersResponse>> {
    return this.client.get<SuccessResponse<GetTopCustomersResponse>>(
      `${this.resource}/top-customers`
    )
  }
}
