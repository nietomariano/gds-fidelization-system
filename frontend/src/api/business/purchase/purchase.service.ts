import { httpClient } from "../../http";
import { Service } from "../../http/Service";
import type { SuccessResponse } from "../../types/Response";
import type {
  CreatePurchaseRequest,
  CreatePurchaseResponse,
  GetPurchasesResponse,
  PurchaseFilters,
} from "./purchase.types";

export class PurchaseService extends Service {
  constructor() {
    super(httpClient, "/business/purchases");
  }

  public async getPurchases(
    filters?: PurchaseFilters
  ): Promise<SuccessResponse<GetPurchasesResponse>> {
    const response = await this.client.get<SuccessResponse<GetPurchasesResponse>>(
      this.resource,
      { params: filters }
    );

    return response;
  }

  public async createPurchase(
    data: CreatePurchaseRequest
  ): Promise<SuccessResponse<CreatePurchaseResponse>> {
    const response = await this.client.post<
      SuccessResponse<CreatePurchaseResponse>,
      CreatePurchaseRequest
    >(this.resource, data);

    return response;
  }
}
