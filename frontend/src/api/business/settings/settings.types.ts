import type { SettingsModel, LoyaltyConfigModel} from "../../types/Models/Settings";

/**
 * GET settings
 */
export interface GetSettingsResponse {
  settings: SettingsModel;
}

/**
 * PUT update settings
 */
export interface CreateSettingsRequest {
    name: string;
    email?: string;
    phone_number?: string;
    address?: string;
    profile_picture?: string;
    instagram_url?: string;
    facebook_url?: string;
    base_amount?: number;
    points_awarded?: number;
    welcome_enabled?: boolean;
    welcome_points?: number;
    expiration_enabled?: boolean;
    expiration_days?: number;
}

export interface CreateSettingsResponse {
  settings: SettingsModel;
}
