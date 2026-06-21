'use server'

import { revalidatePath } from "next/cache"
import { getSupabaseServerClient } from "@/lib/supabase/server-client"

export type ActionState = {
  message: string | null;
  success: boolean;
} | undefined;

export async function signup(prevState: ActionState | undefined, formData: FormData): Promise<ActionState> {
  const supabase = await getSupabaseServerClient()

  // Validate inputs
  if (!formData.get('email') || !formData.get('password') || !formData.get('name')) {
    return { 
      success: false, 
      message: 'Por favor, preencha todos os campos.' 
    }
  }

  if ((formData.get('password') as string).length < 8) {
    return { 
      success: false, 
      message: 'A senha deve ter pelo menos 8 caracteres.' 
    }
  }

  const data = {
    email: (formData.get('email') as string)?.toLowerCase().trim(),
    password: formData.get('password') as string,
    options: {
      data: {
        display_name: (formData.get('name') as string)?.trim(),
      }
    }
  }
  
  const { error } = await supabase.auth.signUp(data)

  if (error) {
    switch (error.code) {
      case 'anonymous_provider_disabled':
        return { 
          success: false, 
          message: 'Não é permitido registro anônimo.'
        }
      case 'email_address_invalid':
        return { 
          success: false, 
          message: 'Por favor, insira um e-mail válido.'
        }
      case 'email_exists':
        return { 
          success: false, 
          message: 'Este e-mail já está em uso.'
        }
      case 'user_already_exists':
        return { 
          success: false, 
          message: 'Este e-mail já está em uso.'
        }
      case 'unexpected_failure':
        return { 
          success: false, 
          message: 'Erro ao enviar e-mail de confirmação.'
        }
      default:
        return { 
          success: false, 
          message: error.message
        }
    }
  }

  revalidatePath('/auth/register')

  return { 
    success: true, 
    message: "Cadastro realizado! Verifique seu e-mail para confirmar." 
  }
}
