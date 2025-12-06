export interface RegisterRequestData {
  first_name: string;
  last_name?: string;
  email?: string;
  phone_number: string;
  password: string;
  password_confirmation: string;
}

export interface LoginRequestData {
  phone_number: string;
  password: string;
}

export interface LoginResponseData {
  token: string;
  customer: {
    id: string;
    first_name: string;
    last_name?: string;
    email?: string;
    phone_number: string;
    phone_validated_at?: string;
  };
}

export interface RegisterResponseData {
  customer: {
    id: string;
    first_name: string;
    last_name?: string;
    email?: string;
    phone_number: string;
  };
  token: string;
}
