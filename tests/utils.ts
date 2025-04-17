import { Page } from '@playwright/test';

export const TEST_USER = {
  email: 'test@example.com',
  password: 'Test123!',
  firstName: 'Test',
  lastName: 'User',
  phone: '+1234567890',
};

export const TEST_PROCEDURE = {
  id: '1',
  name: 'Test Procedure',
  duration: 60,
  price: 100,
};

export async function login(page: Page) {
  await page.goto('/login');
  await page.fill('input[name="email"]', TEST_USER.email);
  await page.fill('input[name="password"]', TEST_USER.password);
  await page.click('button[type="submit"]');
  await page.waitForURL('/dashboard');
}

export async function selectProcedure(page: Page) {
  await page.goto('/procedures');
  await page.click(`text=${TEST_PROCEDURE.name}`);
  await page.waitForSelector('form');
}

export async function fillBookingForm(page: Page) {
  await page.fill('input[name="firstName"]', TEST_USER.firstName);
  await page.fill('input[name="lastName"]', TEST_USER.lastName);
  await page.fill('input[name="email"]', TEST_USER.email);
  await page.fill('input[name="phone"]', TEST_USER.phone);
  await page.fill('input[name="date"]', new Date().toISOString().split('T')[0]);
  await page.selectOption('select[name="time"]', '09:00');
}

export async function mockApiResponse(page: Page, url: string, response: any) {
  await page.route(url, (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(response),
    });
  });
}

export async function mockApiError(page: Page, url: string) {
  await page.route(url, (route) => {
    route.abort('failed');
  });
}
