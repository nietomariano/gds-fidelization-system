export interface LoyaltyConfigModel {
  id: string;
  baseAmount: number;
  pointsAwarded: number;
  welcomeEnabled: boolean;
  welcomePoints: number;
  expirationEnabled: boolean;
  expirationDays: number;
  businessId: string;
  createdAt: string;
  updatedAt: string;
}

export interface SettingsModel {
  id: string;
  email?: string;
  phoneNumber?: string;
  name: string;
  address?: string;
  profilePicture?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  loyaltyConfig?: LoyaltyConfigModel;
  createdAt: string;
  updatedAt: string;
}
