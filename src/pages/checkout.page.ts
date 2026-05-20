import { type Locator, type Page, expect } from '@playwright/test';
import { BasePage } from './base.page';
import type { Address } from '@data/factories';

/**
 * Checkout is a four-step wizard: cart review -> sign in -> billing address
 * -> payment. Each `proceed-N` button advances to the next step.
 */
export class CheckoutPage extends BasePage {
  readonly proceedToSignIn: Locator;
  readonly proceedToAddress: Locator;
  readonly proceedToPayment: Locator;
  readonly street: Locator;
  readonly houseNumber: Locator;
  readonly city: Locator;
  readonly state: Locator;
  readonly country: Locator;
  readonly postalCode: Locator;
  readonly paymentMethod: Locator;
  readonly finish: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    super(page, '/checkout');
    this.proceedToSignIn = page.getByTestId('proceed-1');
    this.proceedToAddress = page.getByTestId('proceed-2');
    this.proceedToPayment = page.getByTestId('proceed-3');
    this.street = page.getByTestId('street');
    this.houseNumber = page.getByTestId('house_number');
    this.city = page.getByTestId('city');
    this.state = page.getByTestId('state');
    this.country = page.getByTestId('country');
    this.postalCode = page.getByTestId('postal_code');
    this.paymentMethod = page.getByTestId('payment-method');
    this.finish = page.getByTestId('finish');
    this.successMessage = page.getByTestId('payment-success-message');
  }

  async reviewCart(): Promise<void> {
    await expect(this.proceedToSignIn).toBeVisible();
    await this.proceedToSignIn.click();
  }

  async confirmSignedIn(): Promise<void> {
    await expect(this.proceedToAddress).toBeVisible();
    await this.proceedToAddress.click();
  }

  async fillBillingAddress(address: Address): Promise<void> {
    // Country first: changing it triggers an auto-fill that clears the other
    // fields, so it has to be set before they're populated.
    await this.selectCountry(address.country);
    await this.street.fill(address.street);
    await this.houseNumber.fill(address.house_number);
    await this.city.fill(address.city);
    await this.state.fill(address.state);
    await this.postalCode.fill(address.postal_code);
    await expect(this.proceedToPayment).toBeEnabled();
    await this.proceedToPayment.click();
  }

  /** Country is a dropdown; fall back to the first real option if the
   * generated country name isn't one of the listed values. */
  private async selectCountry(preferred: string): Promise<void> {
    const options = (await this.country.locator('option').allInnerTexts()).map((o) =>
      o.trim(),
    );
    const match = options.find((option) => option === preferred);
    await this.country.selectOption(match ? { label: match } : { index: 1 });
  }

  async payWith(method: string): Promise<void> {
    await this.paymentMethod.selectOption({ label: method });
    await this.finish.click();
  }
}
