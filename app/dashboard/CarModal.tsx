'use client';

import React, { useEffect } from 'react';
import { X, Save, Car, Hash, Calendar, Layers, Palette, ListOrdered, Tag, FileImage } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { CarFormData } from '../types/Car';
import { addCarToCollection, updateCarInCollection } from './actions';

interface CarModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: CarFormData | null; // dados do carro selecionado
  onSuccess: (data: CarFormData, isEditing: boolean) => void;
}

export default function CarModal({ isOpen, onClose, initialData, onSuccess }: CarModalProps) {
  const isEditing = !!initialData;
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CarFormData>(
    {
      shouldUnregister: true, // Desregistra campos não montados
      defaultValues: initialData || {}
    }
  );

  // Atualiza o form sempre que o initialData mudar
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset(initialData);
      } else {
        // Reseta para valores vazios ao adicionar novo
        reset({
          id: undefined,
          modelName: '',
          modelCode: '',
          collectionYear: undefined,
          serie: '',
          color: '',
          numberInYearCollection: '',
          numberInSerie: '',
          imageUrl: ''
        });
      }
    }
  }, [isOpen, initialData, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data: CarFormData) => {
    if (isEditing) {
      await updateCarInCollection(data)
      onSuccess(data, isEditing);
    } else {
      const savedCar = await addCarToCollection(data)
      onSuccess(savedCar, isEditing);
    }
    
    reset(); // Limpa o formulário
    onClose(); // Fecha o modal
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header do Modal */}
        <div className="bg-slate-900 p-6 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500 rounded-lg">
              <Car size={24} />
            </div>
            <h2 className="text-xl font-bold italic uppercase tracking-tighter">
              {isEditing ? `Editando: ${initialData.modelName}` : 'Novo na Garagem'}
            </h2>
          </div>
          <button id="close-modal" onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* ID carrinho */}
            <div className="hidden md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">ID do Registro</label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  id="register-id"
                  {...register('id')}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-orange-500 outline-none transition-all"
                />
              </div>
            </div>
            
            {/* Nome do Modelo */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Nome do Modelo</label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  id="model-name"
                  {...register('modelName', { required: true })}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-orange-500 outline-none transition-all"
                  placeholder="Ex: Nissan Skyline GT-R (R34)"
                />
              </div>
            </div>

            {/* Código do Modelo */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Código do Modelo</label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  id="model-code"
                  {...register('modelCode')}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-orange-500 outline-none transition-all"
                  placeholder="Ex: HNK34"
                />
              </div>
            </div>

            {/* Ano */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Ano de Lançamento</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  id="collection-year"
                  {...register('collectionYear')}
                  type="number"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-orange-500 outline-none transition-all"
                  placeholder="2024"
                />
              </div>
            </div>

            {/* Série */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Série / Coleção</label>
              <div className="relative">
                <Layers className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  id="serie"
                  {...register('serie')}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-orange-500 outline-none transition-all"
                  placeholder="Ex: J-Imports"
                />
              </div>
            </div>

            {/* Cor */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Cor Predominante</label>
              <div className="relative">
                <Palette className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  id="color"
                  {...register('color')}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-orange-500 outline-none transition-all"
                  placeholder="Ex: Bayside Blue"
                />
              </div>
            </div>

            {/* Número na Coleção Anual */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Número Anual (Ex. 42/250)</label>
              <div className="relative">
                <ListOrdered className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  id="number-in-year-collection"
                  {...register('numberInYearCollection')}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-orange-500 outline-none transition-all"
                  placeholder="000/250"
                />
              </div>
            </div>

            {/* Número na Série */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Número na Série (Ex. 4/10)</label>
              <div className="relative">
                <ListOrdered className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  id="number-in-serie"
                  {...register('numberInSerie')}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-orange-500 outline-none transition-all"
                  placeholder="0/10"
                />
              </div>
            </div>

            {/* URL da Imagem */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">URL da Imagem</label>
              <div className="relative">
                <FileImage className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  id="image-url"
                  {...register('imageUrl', { required: true })}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-orange-500 outline-none transition-all"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          </div>

          {/* Footer / Botões */}
          <div className="pt-6 flex gap-4">
            <button 
              id="cancel"
              type="button"
              onClick={onClose}
              className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-colors uppercase text-sm tracking-widest"
            >
              Cancelar
            </button>
            <button 
              id="save"
              type="submit"
              className="flex-1 py-4 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 transition-shadow shadow-lg shadow-orange-200 uppercase text-sm tracking-widest flex items-center justify-center gap-2"
            >
              <Save size={18} /> {isEditing ? 'Salvar Alterações' : 'Adicionar à Coleção'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}