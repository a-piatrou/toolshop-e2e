import { type APIRequestContext, type APIResponse, request } from '@playwright/test';
import { env } from '@utils/env';
import type { Credentials, NewUser } from '@data/factories';

/**
 * Thin client over the Toolshop REST API. Specs assert on the raw responses;
 * fixtures use the `login`/`registerCustomer` helpers for state setup.
 */
export class ToolshopApi {
  private constructor(
    private readonly context: APIRequestContext,
    private token?: string,
  ) {}

  static async create(token?: string): Promise<ToolshopApi> {
    const context = await request.newContext({ baseURL: env.apiUrl });
    return new ToolshopApi(context, token);
  }

  async dispose(): Promise<void> {
    await this.context.dispose();
  }

  private authHeaders(): Record<string, string> {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {};
  }

  // --- Auth ---------------------------------------------------------------

  loginRaw(credentials: Credentials): Promise<APIResponse> {
    return this.context.post('/users/login', { data: credentials });
  }

  async login(credentials: Credentials): Promise<string> {
    const res = await this.loginRaw(credentials);
    if (!res.ok()) {
      throw new Error(`Login failed (${res.status()}): ${await res.text()}`);
    }
    this.token = (await res.json()).access_token as string;
    return this.token;
  }

  register(user: NewUser): Promise<APIResponse> {
    return this.context.post('/users/register', { data: user });
  }

  /** Current user profile for the token held by this client. */
  getCurrentUser(): Promise<APIResponse> {
    return this.context.get('/users/me', { headers: this.authHeaders() });
  }

  /** Registers a user and returns it enriched with the server-assigned id. */
  async registerCustomer(user: NewUser): Promise<NewUser & { id: string }> {
    const res = await this.register(user);
    if (!res.ok()) {
      throw new Error(`Registration failed (${res.status()}): ${await res.text()}`);
    }
    const { id } = await res.json();
    return { ...user, id };
  }

  // --- Catalog ------------------------------------------------------------

  listProducts(page = 1): Promise<APIResponse> {
    return this.context.get('/products', { params: { page } });
  }

  searchProducts(query: string): Promise<APIResponse> {
    return this.context.get('/products/search', { params: { q: query } });
  }

  getProduct(id: string): Promise<APIResponse> {
    return this.context.get(`/products/${id}`);
  }

  listCategories(): Promise<APIResponse> {
    return this.context.get('/categories');
  }

  listBrands(): Promise<APIResponse> {
    return this.context.get('/brands');
  }
}
