'use server'

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server-client"

export async function login(formData: FormData) {
    const supabase = await getSupabaseServerClient()

    // TODO: validate inputs
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const{ error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        redirect('/error')
    }

    revalidatePath('/login')
    redirect('/dashboard')
}