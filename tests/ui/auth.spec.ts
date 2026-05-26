import { test, expect } from '@fixtures/test';

test.describe('Sign in', () => {
  test('a registered customer can sign in @smoke', async ({
    loginPage,
    navbar,
    customer,
  }) => {
    await loginPage.open();
    await loginPage.login(customer.email, customer.password);

    await expect(navbar.userMenu).toBeVisible();
    await expect(navbar.userMenu).toContainText(customer.first_name);
  });

  const invalidLogins = [
    {
      title: 'a wrong password',
      email: 'customer@practicesoftwaretesting.com',
      password: 'definitely-wrong',
    },
    {
      title: 'an unknown account',
      email: 'no-such-user@practicesoftwaretesting.com',
      password: 'whatever-123',
    },
  ];

  for (const data of invalidLogins) {
    test(`sign in is rejected with ${data.title}`, async ({ loginPage }) => {
      await loginPage.open();
      await loginPage.login(data.email, data.password);

      await loginPage.expectError();
    });
  }
});
