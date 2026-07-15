import { test, expect } from '@playwright/test';
import { createTestCar } from '../../src/fixtures/car.factory';
import { DashboardPage } from '../../src/pages/dashboard.page';

test.describe('Tests for the dashboard module', () => {
    test.describe.configure({ mode: 'serial' });
    
    test('should display the dashboard main element controls', async ({ page }) => {
        await page.goto('/dashboard');

        await expect(page.getByRole('heading', { name: 'HW Collector', level: 1 })).toBeVisible();
        await expect(page.getByText(/Você tem \d+ carrinhos na coleção/)).toBeVisible();
        await expect(page.getByRole('button', { name: 'Sair da Garagem' })).toBeVisible();
        await expect(page.locator('#search')).toBeVisible();
        await expect(page.locator('#add-new-car')).toBeVisible();
        await expect(page.locator('#car-list')).toBeVisible();
    })

    test('should open the add new car form when the "Adicionar" button is clicked', async ({ page }) => {
        await page.goto('/dashboard');

        await page.locator('#add-new-car').click();

        await expect(page.getByRole('heading', { name: 'Novo na Garagem', level: 2 })).toBeVisible();
        await expect(page.locator('form.flex-1')).toBeVisible();
    })

    test.only('should add a car to the collection successfully and display the car details in a card', async ({ page }) => {
        const dashboardPage = new DashboardPage(page);
        const testCarWithImage = createTestCar({ imageUrl: 'https://www.escalaminiaturas.com.br/media/catalog/product/cache/3/image/9df78eab33525d08d6e5fb8d27136e95/f/y/fyc52_01.jpg' });

        await page.goto('/dashboard');
        await dashboardPage.addCarToCollection(testCarWithImage);

        const carCard = page.locator('.car-card', { hasText: testCarWithImage.model });

        await expect(carCard.getByRole('heading', { name: testCarWithImage.model, level: 2 })).toBeVisible();
        await expect(carCard.getByText(`Código: ${testCarWithImage.modelCode}`)).toBeVisible();
        await expect(carCard.getByText(testCarWithImage.year.toString())).toBeVisible();
        await expect(carCard.getByText(`SERIE: ${testCarWithImage.series.toUpperCase()}`)).toBeVisible();
        await expect(carCard.getByText(testCarWithImage.color)).toBeVisible();
        await expect(carCard.getByText(`${testCarWithImage.numInCollection.toString()}/${testCarWithImage.yearCollectionTotal.toString()}`)).toBeVisible();
        await expect(carCard.getByText(`${testCarWithImage.numInSeries.toString()}/${testCarWithImage.seriesCollectionTotal.toString()}`)).toBeVisible();

        // Image assertion
        const cardImg = carCard.locator('img');
        await expect(cardImg).toHaveAttribute('src', testCarWithImage.imageUrl!);
        await expect(cardImg).toBeVisible();

        await dashboardPage.deleteLastAddedCar();
    })
})