import { test, expect } from '@fixtures/test';
import { paginatedProductsSchema, productDetailSchema } from '@api/schemas';

test.describe('Products API @api', () => {
  test('the catalog is paginated and matches the contract @smoke', async ({ api }) => {
    const res = await api.listProducts(1);

    expect(res.ok()).toBeTruthy();
    const body = paginatedProductsSchema.parse(await res.json());
    expect(body.current_page).toBe(1);
    expect(body.data.length).toBeGreaterThan(0);
    expect(body.total).toBeGreaterThanOrEqual(body.data.length);
  });

  test('a product can be retrieved by id with its brand and category', async ({
    api,
  }) => {
    const list = paginatedProductsSchema.parse(await (await api.listProducts(1)).json());
    const expected = list.data[0];

    const res = await api.getProduct(expected.id);

    expect(res.ok()).toBeTruthy();
    const product = productDetailSchema.parse(await res.json());
    expect(product.id).toBe(expected.id);
    expect(product.brand?.name).toBeTruthy();
    expect(product.category?.name).toBeTruthy();
  });

  test('an unknown product id returns 404', async ({ api }) => {
    const res = await api.getProduct('00000000000000000000000000');

    expect(res.status()).toBe(404);
  });

  test('search returns results relevant to the query', async ({ api }) => {
    const res = await api.searchProducts('hammer');

    expect(res.ok()).toBeTruthy();
    const body = paginatedProductsSchema.parse(await res.json());
    expect(body.data.length).toBeGreaterThan(0);
    expect(
      body.data.some((p) => /hammer/i.test(p.name) || /hammer/i.test(p.description)),
    ).toBeTruthy();
  });
});
