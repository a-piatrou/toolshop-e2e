import { test, expect } from '@fixtures/test';
import { loginResponseSchema } from '@api/schemas';
import { buildUser, credentialsOf, type NewUser } from '@data/factories';

const DEMO_CUSTOMER = {
  email: 'customer@practicesoftwaretesting.com',
  password: 'welcome01',
};

test.describe('Auth API @api', () => {
  test('valid credentials return a bearer token @smoke', async ({ api }) => {
    const res = await api.loginRaw(DEMO_CUSTOMER);

    expect(res.status()).toBe(200);
    const body = loginResponseSchema.parse(await res.json());
    expect(body.token_type).toBe('bearer');
    expect(body.expires_in).toBeGreaterThan(0);
  });

  test('a wrong password is rejected with 401', async ({ api }) => {
    const res = await api.loginRaw({ ...DEMO_CUSTOMER, password: 'not-the-password' });

    expect(res.status()).toBe(401);
  });

  test('registration reports the mandatory fields when the body is empty', async ({
    api,
  }) => {
    const res = await api.register({} as NewUser);

    expect(res.status()).toBe(422);
    const errors = await res.json();
    expect(Object.keys(errors)).toEqual(
      expect.arrayContaining(['first_name', 'last_name', 'email', 'password']),
    );
  });

  test('a new user can register and then sign in', async ({ api }) => {
    const user = buildUser();

    const registration = await api.register(user);
    expect(registration.status()).toBe(201);

    const login = await api.loginRaw(credentialsOf(user));
    expect(login.status()).toBe(200);
  });

  test('an authenticated user can read their own profile', async ({ api }) => {
    const user = buildUser();
    await api.registerCustomer(user);
    await api.login(credentialsOf(user));

    const res = await api.getCurrentUser();
    expect(res.ok()).toBeTruthy();
    expect((await res.json()).email).toBe(user.email);
  });
});
