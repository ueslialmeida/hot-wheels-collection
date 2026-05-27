'use client'

import { useActionState } from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import {resetPassword} from './actions';

export default function ResetPasswordPage() {
  const [state, formAction] = useActionState(resetPassword, {success: null, message: null})
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-black italic text-slate-900 tracking-tighter uppercase">
            HW <span className="text-orange-500">Collector</span>
          </h1>
          <h2 className="mt-6 text-2xl font-extrabold text-slate-900">
            Redefinir Senha
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Insira o e-mail da sua conta para redefinir sua senha
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

        {/* Form */}
        <form className="mt-8 space-y-6" action="#" method="POST">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                E-mail <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none text-slate-800 block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
                  placeholder="seu@email.com"
                />
              </div>
            </div>
          </div>

          <div>
            <button
            id='reset-password-button'
              formAction={formAction}
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-slate-900 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Enviar
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}