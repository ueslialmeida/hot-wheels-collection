import { Page, Locator, expect } from '@playwright/test';
import { CarData } from '../fixtures/car.factory';

export class DashboardPage {
    private readonly page: Page;
    private readonly addNewCarButton: Locator;
    private readonly modalForm: Locator;

    private readonly modelInput: Locator;
    private readonly modelCodeInput: Locator;
    private readonly yearInput: Locator;
    private readonly seriesInput: Locator;
    private readonly colorInput: Locator;
    private readonly numInCollectionInput: Locator;
    private readonly yearCollectionTotalInput: Locator;
    private readonly numInSeriesInput: Locator;
    private readonly seriesCollectionTotalInput: Locator;
    private readonly imageUrlInput: Locator;

    private readonly submitButton: Locator;
    private readonly cancelButton: Locator;
    private readonly deleteCarButton: Locator;
    private readonly confirmDeleteButton: Locator;
    private readonly closeModalButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.addNewCarButton = page.locator('#add-new-car');
        this.modalForm = page.locator('form.flex-1');
        this.modelInput = page.locator('#model-name');
        this.modelCodeInput = page.locator('#model-code');
        this.yearInput = page.locator('#collection-year');
        this.seriesInput = page.locator('#series');
        this.colorInput = page.locator('#color');
        this.numInCollectionInput = page.locator('#number-in-year-collection');
        this.yearCollectionTotalInput = page.locator('#year-collection-total');
        this.numInSeriesInput = page.locator('#number-in-series');
        this.seriesCollectionTotalInput = page.locator('#series-collection-total');
        this.imageUrlInput = page.locator('#image-url');
        this.submitButton = page.locator('#save');
        this.cancelButton = page.locator('#cancel');
        this.deleteCarButton = page.locator('#delete');
        this.confirmDeleteButton = page.locator('#confirm-delete');
        this.closeModalButton = page.locator('#close-modal');
    }

    async addCarToCollection(car: CarData) {
        await this.addNewCarButton.click();
        await expect(this.modalForm).toBeVisible();

        await this.modelInput.fill(car.model);
        await this.modelCodeInput.fill(car.modelCode);
        await this.yearInput.fill(car.year.toString());
        await this.seriesInput.fill(car.series);
        await this.colorInput.fill(car.color);
        await this.numInCollectionInput.fill(car.numInCollection.toString());
        await this.yearCollectionTotalInput.fill(car.yearCollectionTotal.toString());
        await this.numInSeriesInput.fill(car.numInSeries.toString());
        await this.seriesCollectionTotalInput.fill(car.seriesCollectionTotal.toString());
        await this.imageUrlInput.fill(car.imageUrl || '');
        await this.submitButton.click();

        await expect(this.modalForm).toBeHidden();
    }

    async deleteLastAddedCar() {
        await this.page.locator('#car-list').first().getByRole('button', { name: 'Editar Registro' }).click();
        await this.deleteCarButton.click();
        await this.confirmDeleteButton.click();
        await expect(this.modalForm).toBeHidden();
    }
}