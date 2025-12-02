import { httpClient } from "../../http";
import { Service } from "../../http/Service";
import type { RewardModel } from "../../types/Models/RewardModel";
import type { Paginated } from "../../types/Paginated";
import type { SuccessResponse } from "../../types/Response";
import type {
  CreateRewardBody,
  RewardsMetricsResponse,
  GetRewardParams,
} from "./reward.types";

export class RewardsService extends Service {
  constructor() {
    super(httpClient, "/business/rewards");
  }

  public async getRewards(params?: GetRewardParams) {
    const { page, per_page } = params ?? {};

    const response = await this.client.get<SuccessResponse<{ rewards: RewardModel[] }>>(
      `${this.resource}`,
      {
        params: {
          page,
          per_page,
        },
      }
    );

    return response;
  }

  public async createReward(data: CreateRewardBody) {
    const response = await this.client.post(`${this.resource}`, data);

    return response;
  }

  public async updateReward(rewardId: string, data: CreateRewardBody) {
    const response = await this.client.put(
      `${this.resource}/${rewardId}`,
      data
    );

    return response;
  }

  public async deleteReward(rewardId: string) {
    const response = await this.client.delete(`${this.resource}/${rewardId}`);

    return response;
  }

  public async getRewardsMetrics() {
    const response = await this.client.get<
      SuccessResponse<RewardsMetricsResponse>
    >(`${this.resource}/metrics`);

    return response;
  }
}
