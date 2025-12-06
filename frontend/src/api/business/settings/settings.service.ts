import { httpClient } from "../../http";
import { Service } from "../../http/Service";
import type { SuccessResponse } from "../../types/Response";
import type {
  CreateSettingsRequest,
  CreateSettingsResponse,
  GetSettingsResponse,
} from "./settings.types";

export class SettingsService extends Service {
  constructor() {
    super(httpClient, "/business/settings");
  }

  public async getSettings(): Promise<SuccessResponse<GetSettingsResponse>> {
    const response = await this.client.get<SuccessResponse<GetSettingsResponse>>(
      this.resource
    );

    return response;
  }



  public async updateSettings(
    data: CreateSettingsRequest
  ): Promise<SuccessResponse<CreateSettingsResponse>> {
    const response = await this.client.put<
      SuccessResponse<CreateSettingsResponse>,
      CreateSettingsRequest
    >(this.resource, data);

    return response;
  }
}
