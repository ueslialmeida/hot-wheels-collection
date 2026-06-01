'use server'

import { revalidatePath } from "next/cache"
import { getSupabaseServerClient } from "@/lib/supabase/server-client"

export type ActionState = {
  message: string | null;
  success: boolean | null;
} | undefined;

export async function updatePassword(prevState: ActionState | undefined, formData: FormData): Promise<ActionState> {
    const supabase = await getSupabaseServerClient()

    // Validate inputs
    if (!formData.get('password')) {
        return { 
            success: false, 
            message: 'Por favor, preencha o campo de senha.' 
        }
    }

    if ((formData.get('password') as string).length < 8) {
        return { 
            success: false, 
            message: 'A senha deve ter pelo menos 8 caracteres.' 
        }
    }

    const data = {
        password: formData.get('password') as string,
    }

    const{ error } = await supabase.auth.updateUser({password: data.password})

    if (error) {
      return { 
        success: false, 
        message: "Erro ao atualizar senha." 
      }
    }

    revalidatePath('/auth/reset-password')

    return { 
        success: true, 
        message: "Senha atualizada com sucesso." 
    }
}