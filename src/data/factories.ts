import { faker } from '@faker-js/faker';

export interface Address {
  street: string;
  house_number: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
}

export interface NewUser {
  first_name: string;
  last_name: string;
  address: Address;
  phone: string;
  dob: string;
  email: string;
  password: string;
}

export interface Credentials {
  email: string;
  password: string;
}

/**
 * The shop screens registration passwords against known breach lists, so a
 * predictable value (e.g. "Welcome01!") is rejected. A random alphanumeric
 * core keeps generated users out of those lists.
 */
function strongPassword(): string {
  return `Aa1!${faker.string.alphanumeric(16)}`;
}

export function buildUser(overrides: Partial<NewUser> = {}): NewUser {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return {
    first_name: firstName,
    last_name: lastName,
    // Unique local part avoids collisions between parallel workers.
    email: `${faker.internet
      .username({ firstName, lastName })
      .toLowerCase()}.${Date.now().toString(36)}${faker.string.alphanumeric(4)}@example.com`,
    password: strongPassword(),
    phone: faker.string.numeric(10),
    dob: faker.date
      .birthdate({ min: 21, max: 65, mode: 'age' })
      .toISOString()
      .slice(0, 10),
    address: {
      street: faker.location.street(),
      house_number: faker.location.buildingNumber(),
      city: faker.location.city(),
      state: faker.location.state(),
      country: faker.location.country(),
      postal_code: faker.location.zipCode(),
    },
    ...overrides,
  };
}

export function credentialsOf(user: NewUser): Credentials {
  return { email: user.email, password: user.password };
}
