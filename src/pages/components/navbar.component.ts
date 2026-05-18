import { type Locator, type Page, expect } from '@playwright/test';

/** Shared top navigation, available on every page. */
export class Navbar {
  readonly signIn: Locator;
  readonly userMenu: Locator;
  readonly cart: Locator;
  readonly cartQuantity: Locator;

  constructor(private readonly page: Page) {
    this.signIn = page.getByTestId('nav-sign-in');
    this.userMenu = page.getByTestId('nav-menu');
    this.cart = page.getByTestId('nav-cart');
    this.cartQuantity = page.getByTestId('cart-quantity');
  }

  async openCart(): Promise<void> {
    await this.cart.click();
  }

  async expectCartCount(count: number): Promise<void> {
    await expect(this.cartQuantity).toHaveText(String(count));
  }

  async signOut(): Promise<void> {
    await this.userMenu.click();
    await this.page.getByTestId('nav-sign-out').click();
  }
}
