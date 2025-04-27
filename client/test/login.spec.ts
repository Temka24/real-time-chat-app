import { test, expect } from '@playwright/test';

test('User can login successfully', async ({ page }) => {
    await page.goto('/login');

    await page.getByPlaceholder('Email').fill('test@example.com');
    await page.getByPlaceholder('Password').fill('password123');
    await page.getByRole('button', { name: 'Login' }).click();

    // 1. Login дараад URL өөрчлөгдөж "/" болсон эсэхийг шалгана
    await page.waitForURL('**/');

    // 2. Хэрэв "/" болсон бол тест Pass гэж үзнэ
    const [response] = await Promise.all([
        page.waitForResponse(
            (resp) => resp.url().includes('/api/login') && resp.request().method() === 'POST',
        ),
        page.locator('input[value="Login"]').click(),
    ]);

    // 2. Response статус 200 байна уу шалгах
    expect(response.status()).toBe(200);

    // 3. Response json-ыг шалгах
    const responseBody = await response.json();
    expect(responseBody.status).toBe(true); // Амжилттай login
    expect(responseBody.token).toBeTruthy(); // token байгаа эсэх
    expect(page.url()).toContain('/');
});
