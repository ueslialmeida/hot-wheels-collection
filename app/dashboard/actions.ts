'use server'

import { getSupabaseServerClient } from "@/lib/supabase/server-client"
import { revalidatePath } from "next/cache"
import { CarFormData } from "../types/Car"

export async function addCarToCollection(carData: CarFormData) {
    const supabase = await getSupabaseServerClient()

    const {data: {user}, error: authError} = await supabase.auth.getUser()

    if (authError || !user) {
        console.error("Erro de autenticação:", authError)
        return { success: false, error: authError?.message }
    }

    const car = {
        model_name: carData.modelName as string,
        model_code: carData.modelCode as string,
        in_year_collection_number: carData.numberInYearCollection as string,
        in_series_collection_number: carData.numberInSerie as string,
        color: carData.color as string,
        image_url: carData.imageUrl as string,
        series_title: carData.serie as string,
        collection_year: Number(carData.collectionYear),
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

    // Mapeia o retorno do banco para o padrão da sua interface
    const mappedNewCar: CarFormData = {
        id: newCar.id,
        modelName: newCar.model_name,
        modelCode: newCar.model_code,
        collectionYear: newCar.collection_year,
        serie: newCar.series_title,
        color: newCar.color,
        imageUrl: newCar.image_url,
        numberInYearCollection: newCar.in_year_collection_number,
        numberInSerie: newCar.in_series_collection_number
    };

    // Atualiza a página de listagem para mostrar o novo carrinho imediatamente
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

    // Mapear os dados para o formato esperado pelo frontend
    const mappedCars = cars.map(car => ({
        id: car.id,
        modelName: car.model_name,
        modelCode: car.model_code,
        numberInYearCollection: car.in_year_collection_number,
        numberInSerie: car.in_series_collection_number,
        color: car.color,
        imageUrl: car.image_url,
        serie: car.series_title,
        collectionYear: car.collection_year
    }))

    return mappedCars as CarFormData[]
}

export async function updateCarInCollection(carData: CarFormData) {
    const supabase = await getSupabaseServerClient()

    if (!carData.id) {
        return { success: false, error: "ID do carrinho é necessário para atualização." }
    }

    const { error } = await supabase
        .from('cars')
        .update({
            model_name: carData.modelName,
            model_code: carData.modelCode,
            in_year_collection_number: carData.numberInYearCollection,
            in_series_collection_number: carData.numberInSerie,
            color: carData.color,
            image_url: carData.imageUrl,
            series_title: carData.serie,
            collection_year: carData.collectionYear
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