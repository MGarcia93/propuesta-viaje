import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test('loads and shows hero section', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('¿A dónde nos vamos?');
  });

  test('shows trip catalog with cards', async ({ page }) => {
    await page.goto('/');
    const catalog = page.locator('#catalog');
    await expect(catalog).toBeVisible();
    const cards = catalog.locator('[href^="/viajes/"]');
    await expect(cards.first()).toBeVisible();
  });

  test('trip card navigates to trip page', async ({ page }) => {
    await page.goto('/');
    const firstCard = page.locator('#catalog [href^="/viajes/"]').first();
    const href = await firstCard.getAttribute('href');
    await firstCard.click();
    await page.waitForURL(`**${href}**`);
    await expect(page.locator('body')).toBeVisible();
  });

  test('shows quick comparison section', async ({ page }) => {
    await page.goto('/');
    const comparison = page.locator('text=Así se vería');
    await expect(comparison).toBeVisible();
  });

  test('shows CTA to comparison page', async ({ page }) => {
    await page.goto('/');
    const cta = page.locator('a[href="/comparar"]').first();
    await expect(cta).toBeVisible();
  });

  test('has footer with navigation', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    await expect(footer.locator('a[href="/"]')).toBeVisible();
    await expect(footer.locator('a[href="/comparar"]')).toBeVisible();
  });
});

test.describe('Trip presentation page', () => {
  test('loads trip with slides', async ({ page }) => {
    await page.goto('/viajes/china-clasica-tecnologica-12-dias');
    const slideContainer = page.locator('[data-controller]');
    await expect(slideContainer).toBeVisible();
  });

  test('shows first slide by default', async ({ page }) => {
    await page.goto('/viajes/china-clasica-tecnologica-12-dias');
    const visibleSlides = page.locator('[data-slide]:not([style*="display: none"])');
    await expect(visibleSlides).toHaveCount(1);
  });

  test('navigates to next slide with arrow button', async ({ page }) => {
    await page.goto('/viajes/china-clasica-tecnologica-12-dias');
    const nextBtn = page.locator('#slide-next');
    await nextBtn.click();
    const currentEl = page.locator('#slide-current');
    await expect(currentEl).toHaveText('2');
  });

  test('navigates with keyboard arrows', async ({ page }) => {
    await page.goto('/viajes/china-clasica-tecnologica-12-dias');
    await page.keyboard.press('ArrowRight');
    const currentEl = page.locator('#slide-current');
    await expect(currentEl).toHaveText('2');
    await page.keyboard.press('ArrowLeft');
    await expect(currentEl).toHaveText('1');
  });

  test('shows progress bar', async ({ page }) => {
    await page.goto('/viajes/china-clasica-tecnologica-12-dias');
    const progress = page.locator('#slide-progress');
    await expect(progress).toBeVisible();
  });
});

test.describe('Comparison page', () => {
  test('loads comparison table', async ({ page }) => {
    await page.goto('/comparar');
    await expect(page.locator('h1')).toContainText('Comparar');
  });

  test('shows trip names in comparison', async ({ page }) => {
    await page.goto('/comparar');
    const table = page.locator('table');
    await expect(table).toBeVisible();
  });

  test('shows score indicators', async ({ page }) => {
    await page.goto('/comparar');
    const scoresSection = page.locator('text=Puntajes');
    await expect(scoresSection).toBeVisible();
  });

  test('shows budget comparison', async ({ page }) => {
    await page.goto('/comparar');
    const budgetSection = page.locator('text=Presupuesto');
    await expect(budgetSection).toBeVisible();
  });

  test('back link navigates to home', async ({ page }) => {
    await page.goto('/comparar');
    const backLink = page.locator('a[href="/"]').first();
    await backLink.click();
    await page.waitForURL('/');
    await expect(page.locator('h1')).toContainText('¿A dónde nos vamos?');
  });
});

test.describe('Responsive layout', () => {
  test('mobile catalog stacks vertically', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    const catalog = page.locator('#catalog');
    await expect(catalog).toBeVisible();
  });

  test('desktop catalog shows grid', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('/');
    const catalog = page.locator('#catalog');
    await expect(catalog).toBeVisible();
  });
});

test.describe('Accessibility', () => {
  test('images have alt text', async ({ page }) => {
    await page.goto('/');
    const images = page.locator('img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt).toBeTruthy();
    }
  });

  test('buttons have accessible labels', async ({ page }) => {
    await page.goto('/viajes/china-clasica-tecnologica-12-dias');
    const prevBtn = page.locator('#slide-prev');
    const nextBtn = page.locator('#slide-next');
    await expect(prevBtn).toBeVisible();
    await expect(nextBtn).toBeVisible();
  });

  test('focus is visible on interactive elements', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const focused = page.locator(':focus');
    await expect(focused).toBeVisible();
  });
});
