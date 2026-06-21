import { CarFormData } from "@/app/types/Car";

/**
 * Sanitizes a value to ensure it is either a valid integer or null.
 * Useful for cleaning front-end data before sending it to PostgreSQL/Supabase.
 */
export const sanitizeNumber = (value: any): number | null => {
  if (value === undefined || value === null || value === "" || isNaN(Number(value))) {
    return null;
  }
  return Number(value);
};

/**
 * Validates the car data according to the following rules:
 * - modelName is required and cannot be empty.
 * - collectionYear, if provided, must be a number between 1900 and the current year.
 * Allows numeric fields to be left blank (optional), but blocks values outside the limits or invalid.
 */
export function validateCarData(carData: CarFormData): { isValid: boolean; error?: string } {
  
  if (!carData.modelName || carData.modelName.trim() === "") {
    return { isValid: false, error: "O nome do modelo é obrigatório." };
  }

  const validationRules = [
    {
      value: carData.collectionYear,
      min: 1900,
      max: new Date().getFullYear(),
      error: "O ano da coleção é inválido. Valores permitidos: 1900 até o ano atual."
    },
    {
      value: carData.numberInYearCollection,
      min: 1,
      max: 300,
      error: "O número na coleção do ano é inválido. Valores permitidos: 1 até 300."
    },
    {
      value: carData.yearCollectionTotal,
      min: 1,
      max: 300,
      error: "O total da coleção do ano é inválido. Valores permitidos: 1 até 300."
    },
    {
      value: carData.numberInSeries,
      min: 1,
      max: 99,
      error: "O número na série é inválido. Valores permitidos: 1 até 99."
    },
    {
      value: carData.seriesCollectionTotal,
      min: 1,
      max: 99,
      error: "O total da coleção da série é inválido. Valores permitidos: 1 até 99."
    }
  ];

  for (const rule of validationRules) {
    
    // Handling for the React Hook Form: if the numeric field was left blank,
    // it generates a NaN of type 'number'. Ignore this and skip to the next rule.
    if (typeof rule.value === "number" && isNaN(rule.value)) {
      continue;
    }

    // Validation for cases where the value exists (is not undefined, null, or an empty string).
    if (rule.value !== undefined && rule.value !== null && rule.value !== "") {
      const numValue = Number(rule.value);

      // If the conversion fails (corrupted letters) or exceeds the stipulated limits, return the respective error.
      if (isNaN(numValue) || numValue < rule.min || numValue > rule.max) {
        return { isValid: false, error: rule.error };
      }
    }
  }

  return { isValid: true };
}
