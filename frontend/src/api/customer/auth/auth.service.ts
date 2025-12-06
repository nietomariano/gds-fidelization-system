import { httpClient } from "../../http";
import { Service } from "../../http/Service";
import type { SuccessResponse } from "../../types/Response";
import type {
  RegisterRequestData,
  RegisterResponseData,
  LoginRequestData,
  LoginResponseData,
} from "./auth.types";

export class CustomerAuthService extends Service {
  constructor() {
    super(httpClient, "/customer/auth");
  }

  async register(
    data: RegisterRequestData
  ): Promise<SuccessResponse<RegisterResponseData>> {
    const response = await this.client.post<
      SuccessResponse<RegisterResponseData>,
      RegisterRequestData
    >(`${this.resource}/register`, data);

    return response;
  }

  async login(
    data: LoginRequestData
  ): Promise<SuccessResponse<LoginResponseData>> {
    const response = await this.client.post<
      SuccessResponse<LoginResponseData>,
      LoginRequestData
    >(`${this.resource}/login`, data);

    return response;
  }

  async logout(): Promise<SuccessResponse<null>> {
    const response = await this.client.post<SuccessResponse<null>>(
      `${this.resource}/logout`
    );

    return response;
  }

  async me(): Promise<SuccessResponse<LoginResponseData["customer"]>> {
    const response = await this.client.get<
      SuccessResponse<LoginResponseData["customer"]>
    >(`${this.resource}/me`);

    return response;
  }
}
