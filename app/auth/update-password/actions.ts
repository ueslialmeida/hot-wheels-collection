'use server'

import { revalidatePath } from "next/cache"
import { getSupabaseServerClient } from "@/lib/supabase/server-client"

export type ActionState = {
  message: string | null;
  success: boolean | null;
} | undefined;

export async function updatePassword(prevState: ActionState | undefined, formData: FormData): Promise<ActionState> {
    const supabase = await getSupabaseServerClient()

    // TODO: validate inputs
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