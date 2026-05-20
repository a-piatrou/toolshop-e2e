import { type Locator, type Page, expect } from '@playwright/test';
import { BasePage } from './base.page';

/** Product detail page. */
export class ProductPage extends BasePage {
  readonly name: Locator;
  readonly unitPrice: Locator;
  readonly quantity: Locator;
  readonly addToCartButton: Locator;

  constructor(page: Page) {
    super(page, '/product');
    this.name = page.getByTestId('product-name');
    this.unitPrice = page.getByTestId('unit-price');
    this.quantity = page.getByTestId('quantity');
    this.addToCartButton = page.getByTestId('add-to-cart');
  }

  async openById(id: string): Promise<void> {
    await this.open(`/product/${id}`);
    await expect(this.addToCartButton).toBeVisible();
  }

  async setQuantity(value: number): Promise<void> {
    await this.quantity.fill(String(value));
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }
}
