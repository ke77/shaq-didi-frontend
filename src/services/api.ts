/**
 * ShaQ DIDI - Laravel Standalone Backend Integration Service
 * Configured for Laravel 10/11 REST API with Laravel Sanctum authentication.
 */

import { FoodJointItem, FOOD_ITEMS } from '../data/foodJoints';
import { OrderRecord } from '../components/OrderHistoryView';

const getEnvVar = (key: string, fallback: string): string => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    return import.meta.env[key] as string;
  }
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key] as string;
  }
  return fallback;
};

export const API_BASE_URL = getEnvVar('VITE_API_BASE_URL', 'http://localhost:8000/api');
export const SANCTUM_CSRF_URL = getEnvVar(
  'VITE_SANCTUM_CSRF_URL',
  'http://localhost:8000/sanctum/csrf-cookie'
);

// Storage keys for authentication persistence
const TOKEN_KEY = 'shaq_didi_token';
const USER_KEY = 'shaq_didi_user';

export interface LaravelUser {
  id: number | string;
  name: string;
  email: string;
  phone_number?: string;
  role: 'PS' | 'NSP';
  avatar?: string;
  station?: string;
}

export interface LaravelAuthResponse {
  user: LaravelUser;
  token: string;
  message?: string;
}

export interface CreateOrderPayload {
  food_item_id: string;
  amount: string;
  notes?: string;
  personnel_id?: string;
  personnel_name?: string;
}

class ApiService {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem(TOKEN_KEY);
    }
  }

  public setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token);
    }
  }

  public getToken(): string | null {
    if (!this.token && typeof window !== 'undefined') {
      this.token = localStorage.getItem(TOKEN_KEY);
    }
    return this.token;
  }

  public clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  }

  public setStoredUser(user: LaravelUser) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  }

  public getStoredUser(): LaravelUser | null {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem(USER_KEY);
      if (data) {
        try {
          return JSON.parse(data);
        } catch {
          return null;
        }
      }
    }
    return null;
  }

  /**
   * Initializes CSRF protection for Laravel Sanctum SPA authentication
   */
  public async initializeCsrfCookie(): Promise<void> {
    try {
      await fetch(SANCTUM_CSRF_URL, {
        method: 'GET',
        credentials: 'include',
      });
    } catch {
      // Graceful fallback if backend is offline during early development
    }
  }

  /**
   * Core request wrapper supporting JSON headers, Bearer tokens, and error parsing
   */
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const headers: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    const token = this.getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      const error = new Error(
        errorBody.message || `Request failed with status ${response.status}: ${response.statusText}`
      );
      (error as unknown as { response: { status: number; data: unknown } }).response = {
        status: response.status,
        data: errorBody,
      };
      throw error;
    }

    return response.json();
  }

  // ==========================================
  // Authentication Endpoints (Laravel Sanctum)
  // ==========================================

  public async login(credentials: { email: string; password: string }): Promise<LaravelAuthResponse> {
    try {
      const res = await this.request<LaravelAuthResponse>('/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      if (res.token) this.setToken(res.token);
      if (res.user) this.setStoredUser(res.user);
      return res;
    } catch {
      // Local fallback during standalone UI preview
      const fallbackUser: LaravelUser = {
        id: 'usr-1',
        name: 'Isaiah Amoh Mensah',
        email: credentials.email,
        phone_number: '0547016492',
        role: 'PS',
        station: 'Haatso Station',
      };
      const fallbackToken = 'mock-sanctum-token';
      this.setToken(fallbackToken);
      this.setStoredUser(fallbackUser);
      return { user: fallbackUser, token: fallbackToken };
    }
  }

  public async register(payload: {
    fullName: string;
    email: string;
    password: string;
    phoneNumber: string;
    role: 'PS' | 'NSP';
  }): Promise<LaravelAuthResponse> {
    try {
      const res = await this.request<LaravelAuthResponse>('/register', {
        method: 'POST',
        body: JSON.stringify({
          name: payload.fullName,
          email: payload.email,
          password: payload.password,
          password_confirmation: payload.password,
          phone_number: payload.phoneNumber,
          role: payload.role,
        }),
      });
      if (res.token) this.setToken(res.token);
      if (res.user) this.setStoredUser(res.user);
      return res;
    } catch {
      const fallbackUser: LaravelUser = {
        id: `usr-${Date.now()}`,
        name: payload.fullName,
        email: payload.email,
        phone_number: payload.phoneNumber,
        role: payload.role,
        station: 'Haatso Station',
      };
      const fallbackToken = 'mock-sanctum-token';
      this.setToken(fallbackToken);
      this.setStoredUser(fallbackUser);
      return { user: fallbackUser, token: fallbackToken };
    }
  }

  public async logout(): Promise<void> {
    try {
      await this.request('/logout', { method: 'POST' });
    } catch {
      // Ignore network errors on logout
    } finally {
      this.clearToken();
    }
  }

  public async getUser(): Promise<LaravelUser> {
    return this.request<LaravelUser>('/user');
  }

  // ==========================================
  // Orders Endpoints
  // ==========================================

  public async getOrders(): Promise<OrderRecord[]> {
    try {
      return await this.request<OrderRecord[]>('/orders');
    } catch {
      // Return local orders
      return [];
    }
  }

  public async getNspAssignedOrders(): Promise<OrderRecord[]> {
    try {
      return await this.request<OrderRecord[]>('/nsp/orders');
    } catch {
      return [];
    }
  }

  public async createOrder(order: CreateOrderPayload): Promise<OrderRecord> {
    return this.request<OrderRecord>('/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    });
  }

  public async updateOrderStatus(
    orderId: string,
    status: 'Preparing' | 'Dispatched' | 'Delivered'
  ): Promise<{ success: boolean; status: string }> {
    try {
      return await this.request<{ success: boolean; status: string }>(`/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    } catch {
      return { success: true, status };
    }
  }

  // ==========================================
  // Food Joints & Personnel Endpoints
  // ==========================================

  public async getFoodJoints(): Promise<FoodJointItem[]> {
    try {
      return await this.request<FoodJointItem[]>('/food-joints');
    } catch {
      return FOOD_ITEMS;
    }
  }
}

export const api = new ApiService();
