import { test, expect } from '@fixtures/test';
import { paginatedProductsSchema } from '@api/schemas';

test.describe('Checkout @regression', () => {
  test('a signed-in customer can complete a purchase', async ({
    api,
    signedIn,
    productPage,
    navbar,
    checkoutPage,
  }) => {
    const { customer } = signedIn;

    const catalog = paginatedProductsSchema.parse(
      await (await api.listProducts(1)).json(),
    );
    const product = catalog.data.find((p) => !p.is_rental) ?? catalog.data[0];

    await productPage.openById(product.id);
    await productPage.addToCart();
    await navbar.expectCartCount(1);

    await checkoutPage.open();
    await checkoutPage.reviewCart();
    await checkoutPage.confirmSignedIn();
    await checkoutPage.fillBillingAddress(customer.address);
    await checkoutPage.payWith('Cash on Delivery');

    await expect(checkoutPage.successMessage).toBeVisible();
  });
});
