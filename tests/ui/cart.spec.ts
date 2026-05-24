import { test } from '@fixtures/test';
import { paginatedProductsSchema } from '@api/schemas';

test.describe('Shopping cart', () => {
  test('a product can be added to the cart from its detail page @smoke', async ({
    api,
    productPage,
    navbar,
  }) => {
    // Pick a real, purchasable product via the API instead of hard-coding an id.
    const catalog = paginatedProductsSchema.parse(
      await (await api.listProducts(1)).json(),
    );
    const product = catalog.data.find((p) => !p.is_rental) ?? catalog.data[0];

    await productPage.openById(product.id);
    await productPage.addToCart();

    await navbar.expectCartCount(1);
  });
});
