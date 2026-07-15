export interface CarData {
    model: string;
    modelCode: string;
    year: number;
    series: string;
    color: string;
    numInCollection: number;
    yearCollectionTotal: number;
    numInSeries: number;
    seriesCollectionTotal: number;
    imageUrl?: string;
}

export function createTestCar(overrides?: Partial<CarData>): CarData {
    return {
        model: `Test Car ${Date.now()}`,
        modelCode: 'HKND-1234',
        year: 2024,
        series: 'J-Imports',
        color: 'Black',
        numInCollection: 42,
        yearCollectionTotal: 250,
        numInSeries: 2,
        seriesCollectionTotal: 5,
        ...overrides,
    };
}