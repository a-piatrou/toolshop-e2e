import { type Locator, type Page, expect } from '@playwright/test';
import { BasePage } from './base.page';

export type SortOption = 'name,asc' | 'name,desc' | 'price,asc' | 'price,desc';

/** Catalog / landing page: product grid, search and sorting. */
export class HomePage extends BasePage {
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly sort: Locator;
  readonly productNames: Locator;
  readonly productPrices: Locator;

  constructor(page: Page) {
    super(page, '/');
    this.searchInput = page.getByTestId('search-query');
    this.searchButton = page.getByTestId('search-submit');
    this.sort = page.getByTestId('sort');
    this.productNames = page.getByTestId('product-name');
    this.productPrices = page.getByTestId('product-price');
  }

  async waitForGrid(): Promise<void> {
    await expect(this.productNames.first()).toBeVisible();
  }

  async search(query: string): Promise<void> {
    const response = this.waitForProducts();
    await this.searchInput.fill(query);
    await this.searchButton.click();
    await response;
    await this.waitForGrid();
  }

  async sortBy(option: SortOption): Promise<void> {
    const response = this.waitForProducts();
    await this.sort.selectOption(option);
    await response;
  }

  async names(): Promise<string[]> {
    return (await this.productNames.allInnerTexts()).map((t) => t.trim());
  }

  async prices(): Promise<number[]> {
    const labels = await this.productPrices.allInnerTexts();
    return labels.map((label) => Number(label.replace(/[^0-9.]/g, '')));
  }

  async openProduct(name: string): Promise<void> {
    await this.page.locator('a.card', { hasText: name }).first().click();
  }

  /** The grid is API-driven; wait on the request that backs search/sort. */
  private waitForProducts(): Promise<unknown> {
    return this.page.waitForResponse(
      (res) => /\/products(\/search)?\b/.test(res.url()) && res.ok(),
    );
  }
}
