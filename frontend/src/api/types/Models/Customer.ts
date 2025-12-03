export interface CustomerModel {
  id: string;
  first_name: string;
  last_name?: string;
  phone_number: string;
  email?: string;
  profile_picture?: string;
  phone_validated_at?: string;
  created_at: string;
  updated_at: string;
}
