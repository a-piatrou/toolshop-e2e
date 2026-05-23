import { test, expect } from '@fixtures/test';
import { z } from 'zod';
import { brandSchema, categorySchema } from '@api/schemas';

test.describe('Taxonomy API @api', () => {
  test('categories are exposed as a parent/child tree', async ({ api }) => {
    const res = await api.listCategories();

    expect(res.ok()).toBeTruthy();
    const categories = z.array(categorySchema).parse(await res.json());
    expect(categories.length).toBeGreaterThan(0);
    expect(categories.some((c) => c.parent_id === null)).toBeTruthy();
    expect(categories.some((c) => c.parent_id !== null)).toBeTruthy();
  });

  test('brands are returned as a flat list', async ({ api }) => {
    const res = await api.listBrands();

    expect(res.ok()).toBeTruthy();
    const brands = z.array(brandSchema).parse(await res.json());
    expect(brands.length).toBeGreaterThan(0);
  });
});
