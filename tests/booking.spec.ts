import { test, expect } from '@playwright/test';
import { login, selectProcedure, fillBookingForm, mockApiResponse, mockApiError, TEST_PROCEDURE } from './utils';

test.describe('Booking Flow', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('successful booking flow', async ({ page }) => {
    await selectProcedure(page);
    await fillBookingForm(page);

    // Mock successful booking response
    await mockApiResponse(page, '**/api/bookings', {
      id: '1',
      status: 'confirmed',
      procedure: TEST_PROCEDURE,
      date: new Date().toISOString(),
      time: '09:00',
    });

    await page.click('button[type="submit"]');
    await expect(page.locator('text=Booking confirmed')).toBeVisible();
    await expect(page.locator('text=We have sent you a confirmation email')).toBeVisible();
  });

  test('form validation', async ({ page }) => {
    await selectProcedure(page);

    // Test required fields
    await page.click('button[type="submit"]');
    await expect(page.locator('text=First name is required')).toBeVisible();
    await expect(page.locator('text=Last name is required')).toBeVisible();
    await expect(page.locator('text=Email is required')).toBeVisible();
    await expect(page.locator('text=Phone is required')).toBeVisible();
    await expect(page.locator('text=Date is required')).toBeVisible();
    await expect(page.locator('text=Time is required')).toBeVisible();

    // Test invalid email
    await page.fill('input[name="email"]', 'invalid-email');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Please enter a valid email address')).toBeVisible();

    // Test invalid phone
    await page.fill('input[name="phone"]', '123');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Please enter a valid phone number')).toBeVisible();

    // Test past date
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    await page.fill('input[name="date"]', pastDate.toISOString().split('T')[0]);
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Please select a future date')).toBeVisible();
  });

  test('unavailable time slots', async ({ page }) => {
    await selectProcedure(page);
    await fillBookingForm(page);

    // Mock unavailable time slots response
    await mockApiResponse(page, '**/api/bookings', {
      error: 'Time slot is not available',
    }, 400);

    await page.click('button[type="submit"]');
    await expect(page.locator('text=Selected time slot is not available')).toBeVisible();
  });

  test('network error handling', async ({ page }) => {
    await selectProcedure(page);
    await fillBookingForm(page);

    // Mock network error
    await mockApiError(page, '**/api/bookings');

    await page.click('button[type="submit"]');
    await expect(page.locator('text=Something went wrong. Please try again later.')).toBeVisible();
  });
});
