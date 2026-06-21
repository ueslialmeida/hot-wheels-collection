'use server'

import { getSupabaseServerClient } from "@/lib/supabase/server-client"
import { revalidatePath } from "next/cache"
import { CarFormData } from "../types/Car"
import { validateCarData, sanitizeNumber } from "../../utils/validateCar"

export async function addCarToCollection(carData: CarFormData) {
    const supabase = await getSupabaseServerClient()

    const {data: {user}, error: authError} = await supabase.auth.getUser()

    if (authError || !user) {
        console.error("Erro de autenticação:", authError)
        return { success: false, error: authError?.message }
    }

    const validation = validateCarData(carData)
    if (!validation.isValid) {
        return { success: false, error: validation.error }
    }

    const car = {
        model_name: (carData.modelName as string)?.trim(),
        model_code: (carData.modelCode as string)?.toUpperCase().trim(),
        year_collection_number: sanitizeNumber(carData.numberInYearCollection),
        year_collection_total: sanitizeNumber(carData.yearCollectionTotal),
        series_collection_number: sanitizeNumber(carData.numberInSeries),
        series_collection_total: sanitizeNumber(carData.seriesCollectionTotal),
        color: (carData.color as string)?.trim(),
        image_url: (carData.imageUrl as string)?.trim(),
        series_title: (carData.series as string)?.trim(),
        collection_year: sanitizeNumber(carData.collectionYear),
        user_id: user.id
    }

    const { data: newCar, error } = await supabase
        .from('cars')
        .insert(car)
        .select()
        .single()

    if (error) {
        console.error(error)
        return { success: false, error: error.message }
    }

    // Maps the data to the format expected by the frontend
    const mappedNewCar: CarFormData = {
        id: newCar.id,
        modelName: newCar.model_name,
        modelCode: newCar.model_code,
        collectionYear: newCar.collection_year,
        series: newCar.series_title,
        color: newCar.color,
        imageUrl: newCar.image_url,
        numberInYearCollection: newCar.year_collection_number,
        yearCollectionTotal: newCar.year_collection_total,
        numberInSeries: newCar.series_collection_number,
        seriesCollectionTotal: newCar.series_collection_total
    };

    // Updates the listing page to show the new car immediately
    revalidatePath('/dashboard')
    return mappedNewCar
}

export async function getCarsInCollection() {
    const supabase = await getSupabaseServerClient()

    const {data: cars, error} = await supabase
        .from('cars')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        return { success: false, error: 'Não foi possível carregar a sua coleção.' }
    }

    // Maps the data to the format expected by the frontend
    const mappedCars = cars.map(car => ({
        id: car.id,
        modelName: car.model_name,
        modelCode: car.model_code,
        numberInYearCollection: car.year_collection_number,
        yearCollectionTotal: car.year_collection_total,
        numberInSeries: car.series_collection_number,
        seriesCollectionTotal: car.series_collection_total,
        color: car.color,
        imageUrl: car.image_url,
        series: car.series_title,
        collectionYear: car.collection_year
    }))

    return mappedCars as CarFormData[]
}

export async function updateCarInCollection(carData: CarFormData) {
    const supabase = await getSupabaseServerClient()

    if (!carData.id) {
        return { success: false, error: "ID do carrinho é necessário para atualização." }
    }

    const validation = validateCarData(carData)
    if (!validation.isValid) {
        return { success: false, error: validation.error }
    }

    const { error } = await supabase
        .from('cars')
        .update({
            model_name: (carData.modelName as string)?.trim(),
            model_code: (carData.modelCode as string)?.toUpperCase().trim(),
            year_collection_number: sanitizeNumber(carData.numberInYearCollection),
            year_collection_total: sanitizeNumber(carData.yearCollectionTotal),
            series_collection_number: sanitizeNumber(carData.numberInSeries),
            series_collection_total: sanitizeNumber(carData.seriesCollectionTotal),
            color: (carData.color as string)?.trim(),
            image_url: (carData.imageUrl as string)?.trim(),
            series_title: (carData.series as string)?.trim(),
            collection_year: sanitizeNumber(carData.collectionYear)
        })
        .eq('id', carData.id)

    if (error) {
        return { success: false, error: "Não foi possível atualizar o carrinho." }
    }

    revalidatePath('/dashboard')
    return { success: true }
}

export async function deleteCarFromCollection(carId: string) {
    const supabase = await getSupabaseServerClient()

    const { error } = await supabase
        .from('cars')
        .delete()
        .eq('id', carId)

    if (error) {
        return { success: false, error: "Não foi possível remover o carrinho da garagem." }
    }

    revalidatePath('/dashboard')
    return { success: true }
}