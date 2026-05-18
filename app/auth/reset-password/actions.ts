'use server'

import { revalidatePath } from "next/cache"
import { getSupabaseServerClient } from "@/lib/supabase/server-client"

export type ActionState = {
  message: string | null;
  success: boolean | null;
} | undefined;

export async function resetPassword(prevState: ActionState | undefined, formData: FormData): Promise<ActionState> {
    const supabase = await getSupabaseServerClient()

    // TODO: validate inputs
    const data = {
        email: formData.get('email') as string,
    }

    const{ error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/update-password`
    })

    if (error) {
      return { 
        success: false, 
        message: "Erro ao enviar link para redefinição de senha." 
      }
    }

    revalidatePath('/auth/reset-password')

    return { 
        success: true, 
        message: "Link para redefinição de senha enviado." 
    }
}