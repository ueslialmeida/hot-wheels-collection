'use client';

import React, { useActionState } from 'react';
import { User, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { signup } from './actions';

// Schema de validação com Zod
const registerSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
  email: z.email('Insira um e-mail válido'),
  password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(signup, undefined)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-black italic text-slate-900 tracking-tighter uppercase">
            HW <span className="text-orange-500">Collector</span>
          </h1>
          <h2 className="mt-6 text-2xl font-extrabold text-slate-900">
            Crie sua conta
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Junte-se a nós e comece a sua garagem hoje mesmo.
          </p>
          {state?.success && (
            <div className="bg-green-50 mt-4 text-green-800 border border-green-200 rounded-lg p-3 text-sm font-medium text-center mb-4 w-full">
                {state.message}
            </div>
          )}
          {state?.success === false && (
            <div className="bg-red-50 mt-4 text-red-800 border border-red-200 rounded-lg p-3 text-sm font-medium text-center mb-4 w-full">
                {state?.message}
            </div>
          )}
        </div>

        <form className="mt-8 space-y-5" >
          <div className="space-y-4">
            {/* Campo Nome */}
            <div>
              <label className="block text-sm font-medium text-slate-700">Nome Completo</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                id='name'
                type="text"
                required
                  {...register('name')}
                  className={`block text-slate-800 w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all sm:text-sm
                    ${errors.name ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-blue-500 focus:border-transparent'}`}
                  placeholder="Seu nome"
                />
              </div>
              {errors.name && <p className="mt-1 text-xs text-red-500 font-medium">{errors.name.message}</p>}
            </div>

            {/* Campo Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700">E-mail</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                id='email'
                  {...register('email')}
                  type="email"
                  required
                  className={`block text-slate-800 w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all sm:text-sm
                    ${errors.email ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-blue-500 focus:border-transparent'}`}
                  placeholder="exemplo@email.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500 font-medium">{errors.email.message}</p>}
            </div>

            {/* Campo Senha */}
            <div>
              <label className="block text-sm font-medium text-slate-700">Senha</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id='password'
                  {...register('password')}
                  type="password"
                  required
                  className={`block text-slate-800 w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all sm:text-sm
                    ${errors.password ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-blue-500 focus:border-transparent'}`}
                  placeholder="No mínimo 8 caracteres"
                />
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500 font-medium">{errors.password.message}</p>}
            </div>
          </div>

          <button
          id='register'
            formAction={formAction}
            type="submit"
            disabled={isSubmitting}
            className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-slate-900 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Criando conta...' : 'Cadastrar agora'}
            {!isSubmitting && <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-slate-600">
            Já possui uma conta?{' '}
            <Link href="/auth/login" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}