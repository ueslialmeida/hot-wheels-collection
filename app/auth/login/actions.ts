'use server'

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server-client"

export async function login(prevState: {error: string | null}, formData: FormData) {
    const supabase = await getSupabaseServerClient()

    // Validate inputs
    if (!formData.get('email') || !formData.get('password')) {
        return {error: 'Por favor, preencha todos os campos.'}
    }

    const data = {
        email: (formData.get('email') as string)?.toLowerCase().trim(),
        password: formData.get('password') as string,
    }

    const{ error } = await supabase.auth.signInWithPassword(data)

    if (error) {
      switch (error.code) {
        case 'invalid_credentials':
            return {error: 'E-mail ou senha incorretos.'}
        case 'email_not_confirmed':
            return {error: 'Por favor, confirme seu e-mail antes de fazer login.'}
        case 'rate_limit_exceeded':
            return {error: 'Muitas tentativas. Tente novamente mais tarde.'}
        default:
          return {error: error.message}
      }
    }

    revalidatePath('/auth/login')
    redirect('/dashboard')
}