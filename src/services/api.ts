import { FoodJointItem, FOOD_ITEMS } from '../data/foodJoints';
import { OrderRecord } from '../components/OrderHistoryView';
import { UserProfile } from '../types';

export const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api';

const TOKEN_KEY = 'shaq_didi_token';
const DEFAULT_STATION = 'Haatso Station';

export type AppRole = 'PS' | 'NSP';
type BackendRole = 'permanent_staff' | 'national_service';

const ROLE_FROM_BACKEND: Record<BackendRole, AppRole> = {
  permanent_staff: 'PS',
  national_service: 'NSP',
};

const ROLE_TO_BACKEND: Record<AppRole, BackendRole> = {
  PS: 'permanent_staff',
  NSP: 'national_service',
};

interface BackendUser {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  role: BackendRole;
}

interface AuthResponse {
  message: string;
  user: BackendUser;
  token: string;
}

interface BackendRestaurant {
  id: number;
  name: string;
  description: string | null;
  location: string;
}

interface BackendProduct {
  id: number;
  restaurant_id: number;
  name: string;
  description: string | null;
  price: number;
  is_available: boolean;
}

interface BackendOrder {
  id: number;
  product_id: number;
  personnel_id: number | null;
  product_name: string;
  product_price: number;
  amount: number;
  total_price: number;
  order_note: string | null;
  status: 'pending' | 'completed' | 'cancelled';
  created_at: string;
  product?: BackendProduct & { restaurant?: BackendRestaurant };
  personnel?: BackendUser | null;
  user?: BackendUser | null;
}

interface BackendPersonnel {
  id: number;
  name: string;
  role: BackendRole;
}

export interface RegisterInput {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: AppRole;
}

export interface CreateOrderPayload {
  product_id: number;
  amount: number;
  order_note: string;
  personnel_id: number;
}

export interface PersonnelMember {
  id: string;
  name: string;
  role: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly fieldErrors: Record<string, string[]> = {}
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) {
    return Object.values(error.fieldErrors)[0]?.[0] ?? error.message;
  }
  return fallback;
}

const toUserProfile = (user: BackendUser): UserProfile => ({
  id: String(user.id),
  fullName: user.name,
  email: user.email,
  phoneNumber: user.phone_number ?? '',
  role: ROLE_FROM_BACKEND[user.role],
  station: DEFAULT_STATION,
});

const getCatalogImage = (index: number): string =>
  FOOD_ITEMS[index % FOOD_ITEMS.length].image;

const toFoodJoint = (
  restaurant: BackendRestaurant,
  products: BackendProduct[],
  index: number
): FoodJointItem => {
  const menu = products
    .filter((product) => product.is_available)
    .map((product) => ({
      id: String(product.id),
      name: product.name,
      description: product.description ?? '',
      priceGHS: product.price / 100,
    }));

  return {
    id: String(restaurant.id),
    name: restaurant.name,
    jointName: restaurant.name,
    featuredDish: menu[0]?.name ?? restaurant.name,
    location: restaurant.location,
    image: getCatalogImage(index),
    priceGHS: menu[0]?.priceGHS ?? 0,
    rating: 0,
    prepTime: '',
    description: restaurant.description ?? '',
    category: 'Other',
    isPopular: false,
    isMostOrdered: false,
    orderCount: 0,
    menu,
  };
};

class ApiService {
  private token: string | null =
    typeof window === 'undefined' ? null : localStorage.getItem(TOKEN_KEY);
  private onUnauthorized: (() => void) | null = null;

  public getToken(): string | null {
    return this.token;
  }

  public setUnauthorizedHandler(handler: (() => void) | null): void {
    this.onUnauthorized = handler;
  }

  public clearToken(): void {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
    }
  }

  private setToken(token: string): void {
    this.token = token;
    localStorage.setItem(TOKEN_KEY, token);
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    authenticated = true
  ): Promise<T> {
    const headers = new Headers(options.headers);
    headers.set('Accept', 'application/json');
    if (options.body && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    const token = authenticated ? this.token : null;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    let response: Response;
    try {
      response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
    } catch {
      throw new ApiError(
        'Cannot reach the server. Check your connection and try again.',
        0
      );
    }

    if (response.status === 401 && token) {
      this.clearToken();
      this.onUnauthorized?.();
    }

    if (!response.ok) {
      let body: { message?: string; errors?: Record<string, string[]> } = {};
      try {
        body = await response.json();
      } catch {
        body = {};
      }
      throw new ApiError(
        body.message ?? `Request failed (${response.status})`,
        response.status,
        body.errors ?? {}
      );
    }

    if (response.status === 204) {
      return undefined as T;
    }
    return (await response.json()) as T;
  }

  public async login(credentials: {
    email: string;
    password: string;
  }): Promise<UserProfile> {
    const response = await this.request<AuthResponse>(
      '/auth/login',
      { method: 'POST', body: JSON.stringify(credentials) },
      false
    );
    this.setToken(response.token);
    return toUserProfile(response.user);
  }

  public async register(input: RegisterInput): Promise<UserProfile> {
    const response = await this.request<AuthResponse>(
      '/auth/register',
      {
        method: 'POST',
        body: JSON.stringify({
          role: ROLE_TO_BACKEND[input.role],
          name: input.fullName,
          email: input.email,
          password: input.password,
          phone_number: input.phoneNumber,
        }),
      },
      false
    );
    this.setToken(response.token);
    return toUserProfile(response.user);
  }

  public async getCurrentUser(): Promise<UserProfile> {
    return toUserProfile(await this.request<BackendUser>('/me'));
  }

  public async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      this.clearToken();
    }
  }

  public async getFoodJoints(): Promise<FoodJointItem[]> {
    const [restaurants, products] = await Promise.all([
      this.request<BackendRestaurant[]>('/restaurants'),
      this.request<BackendProduct[]>('/products'),
    ]);
    return restaurants
      .map((restaurant, index) =>
        toFoodJoint(
          restaurant,
          products.filter((product) => product.restaurant_id === restaurant.id),
          index
        )
      )
      .filter((restaurant) => restaurant.menu.length > 0);
  }

  public async getPersonnel(): Promise<PersonnelMember[]> {
    const personnel = await this.request<BackendPersonnel[]>('/personnel');
    return personnel.map((person) => ({
      id: String(person.id),
      name: person.name,
      role: ROLE_FROM_BACKEND[person.role] === 'NSP' ? 'National Service Personnel' : 'Permanent Staff',
    }));
  }

  public async getOrders(): Promise<OrderRecord[]> {
    const orders = await this.request<BackendOrder[]>('/orders');
    return orders.map((order) => this.toOrderRecord(order));
  }

  public async getTodayOrders(): Promise<OrderRecord[]> {
    const orders = await this.request<BackendOrder[]>('/orders/today');
    return orders.map((order) => this.toOrderRecord(order));
  }

  public async createOrder(payload: CreateOrderPayload): Promise<OrderRecord> {
    const response = await this.request<{ order: BackendOrder }>('/place-order', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return this.toOrderRecord(response.order);
  }

  public async completeOrder(orderId: string): Promise<OrderRecord> {
    const response = await this.request<{ order: BackendOrder }>(
      `/orders/${encodeURIComponent(orderId)}/complete`,
      { method: 'PATCH' }
    );
    return this.toOrderRecord(response.order);
  }

  public async cancelOrder(orderId: string): Promise<OrderRecord> {
    const response = await this.request<{ order: BackendOrder }>(
      `/orders/${encodeURIComponent(orderId)}/cancel`,
      { method: 'PATCH' }
    );
    return this.toOrderRecord(response.order);
  }

  private toOrderRecord(order: BackendOrder): OrderRecord {
    const restaurant = order.product?.restaurant;
    if (!restaurant || !order.product) {
      throw new ApiError('The API did not return restaurant details for this order.', 502);
    }
    const item = toFoodJoint(restaurant, [order.product], restaurant.id - 1);
    const date = new Date(order.created_at);

    return {
      id: String(order.id),
      item,
      menuItemName: order.product_name,
      quantity: order.amount,
      totalGHS: order.total_price / 100,
      amount: (order.total_price / 100).toFixed(2),
      personnel: order.personnel?.name,
      staffName: order.user?.name,
      staffPhone: order.user?.phone_number,
      notes: order.order_note ?? undefined,
      date: Number.isNaN(date.getTime()) ? order.created_at : date.toLocaleString(),
      status:
        order.status === 'completed'
          ? 'Completed'
          : order.status === 'cancelled'
            ? 'Cancelled'
            : 'Pending',
    };
  }
}

export const api = new ApiService();
