import { test, expect } from '@fixtures/test';

test.describe('Product catalog', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.open();
    await homePage.waitForGrid();
  });

  test('the landing page renders the product grid @smoke', async ({ homePage }) => {
    expect((await homePage.names()).length).toBeGreaterThan(0);
  });

  test('search narrows the catalog to matching products', async ({ homePage }) => {
    await homePage.search('Pliers');

    const names = await homePage.names();
    expect(names.length).toBeGreaterThan(0);
    expect(names.some((name) => /pliers/i.test(name))).toBeTruthy();
  });

  test('the catalog can be sorted by price ascending', async ({ homePage }) => {
    await homePage.sortBy('price,asc');

    await expect.poll(async () => isSorted(await homePage.prices(), 'asc')).toBeTruthy();
  });

  test('the catalog can be sorted by price descending', async ({ homePage }) => {
    await homePage.sortBy('price,desc');

    await expect.poll(async () => isSorted(await homePage.prices(), 'desc')).toBeTruthy();
  });
});

function isSorted(values: number[], direction: 'asc' | 'desc'): boolean {
  if (values.length < 2) return true;
  return values.every((value, i) => {
    if (i === 0) return true;
    return direction === 'asc' ? values[i - 1] <= value : values[i - 1] >= value;
  });
}
