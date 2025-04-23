import { test, expect } from '@playwright/test'




test('google oauth login', async ({ page }) => {
    await page.goto('http://localhost:3000/login')
    await page.getByRole('button', { name: 'Continue with Google' }).click()
    
    // Handle Google OAuth popup
    const googlePopup = await page.waitForEvent('popup')
    await googlePopup.waitForLoadState()
    
    // Fill Google credentials
    
    
    // Wait for redirect back to app
    await page.waitForURL('http://localhost:3000')
    await expect(page).toHaveURL('http://localhost:3000')
})

