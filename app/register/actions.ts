'use server'

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export async function signup(formData: FormData) {
  const supabase = await createClient()

  console.log('CHEGOU AQUI!')

  // TODO: validate inputs
  const data = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }
  
  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/register')
  redirect('/login')
}