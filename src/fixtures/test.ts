import { test as base, expect } from '@playwright/test';
import { ToolshopApi } from '@api/toolshop-api';
import { Navbar } from '@pages/components/navbar.component';
import { HomePage } from '@pages/home.page';
import { ProductPage } from '@pages/product.page';
import { LoginPage } from '@pages/login.page';
import { CheckoutPage } from '@pages/checkout.page';
import { buildUser, type NewUser } from '@data/factories';

export type RegisteredCustomer = NewUser & { id: string };

interface Fixtures {
  api: ToolshopApi;
  navbar: Navbar;
  homePage: HomePage;
  productPage: ProductPage;
  loginPage: LoginPage;
  checkoutPage: CheckoutPage;
  /** A freshly registered customer, created through the API. */
  customer: RegisteredCustomer;
  /** A page already signed in as `customer`. */
  signedIn: { customer: RegisteredCustomer };
}

export const test = base.extend<Fixtures>({
  api: async ({}, use) => {
    const api = await ToolshopApi.create();
    await use(api);
    await api.dispose();
  },

  navbar: async ({ page }, use) => use(new Navbar(page)),
  homePage: async ({ page }, use) => use(new HomePage(page)),
  productPage: async ({ page }, use) => use(new ProductPage(page)),
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  checkoutPage: async ({ page }, use) => use(new CheckoutPage(page)),

  customer: async ({ api }, use) => {
    const customer = await api.registerCustomer(buildUser());
    await use(customer);
  },

  signedIn: async ({ loginPage, navbar, customer }, use) => {
    await loginPage.open();
    await loginPage.login(customer.email, customer.password);
    await expect(navbar.userMenu).toBeVisible();
    await use({ customer });
  },
});

export { expect };
