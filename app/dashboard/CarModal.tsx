'use client';

import { useEffect, useState } from 'react';
import { X, Save, Car, Hash, Calendar, Layers, Palette, ListOrdered, Tag, FileImage, Trash2, TriangleAlert } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { CarFormData } from '../types/Car';
import { addCarToCollection, updateCarInCollection, deleteCarFromCollection } from './actions';

interface CarModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: CarFormData | null; // Selected car data
  onSuccess: (data: CarFormData, isEditing: boolean) => void;
  onDeleteSuccess: (id: string) => void;
}

export default function CarModal({ isOpen, onClose, initialData, onSuccess, onDeleteSuccess }: CarModalProps) {
  const isEditing = !!initialData;
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CarFormData>(
    {
      shouldUnregister: true, // Unregister inputs when unmounted to prevent stale data
      defaultValues: initialData || {}
    }
  );

  // Updates the form values whenever the modal opens or the initialData changes
  useEffect(() => {
    if (isOpen) {
      setIsConfirmingDelete(false);
      setServerError(null); // Clears previous server errors on new submission attempt
      if (initialData) {
        reset(initialData);
      } else {
        // Resets the form to empty values when opening for a new car
        reset({
          id: '',
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
    setServerError(null); // Clears previous server errors on new submission attempt

    if (isEditing) {
      const updatedCar = await updateCarInCollection(data);
      
      // Data validation from backend when editing
      if (updatedCar && 'success' in updatedCar && !updatedCar.success) {
        setServerError(updatedCar.error || "Erro ao atualizar o carrinho.");
        return;
      }
      
      onSuccess(data, isEditing);
    } else {
      const savedCar = await addCarToCollection(data);
      
      // Data validation from backend when adding a new car
      if (savedCar && 'success' in savedCar) {
        if (!savedCar.success) {
          setServerError(savedCar.error || "Erro ao salvar o carrinho.");
          return;
        }
      } else {
        onSuccess(savedCar as CarFormData, isEditing);
      }
    }
    
    reset(); // Clear the form
    onClose(); // Closes the modal
  };

  const handleDelete = async () => {
    if (initialData?.id) {
      await deleteCarFromCollection(initialData.id);
      onDeleteSuccess(initialData.id);
      reset();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 md:p-6">
      {/* Modal main container */}
      <div className="bg-white w-full max-w-2xl max-h-[85vh] md:max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        
        {/* Modal header - fixed at the top */}
        <div className="bg-slate-900 p-5 md:p-6 flex justify-between items-center text-white shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isConfirmingDelete ? 'bg-red-500' : 'bg-orange-500'}`}>
              <Car size={22} className="md:size-6" />
            </div>
            <h2 className="text-lg md:text-xl font-bold italic uppercase tracking-tighter line-clamp-1">
              {isConfirmingDelete 
                ? 'Remover da Garagem?' 
                : isEditing ? `Editando: ${initialData?.modelName}` : 'Novo na Garagem'}
            </h2>
          </div>
          <button id="close-modal" onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={22} className="md:size-6" />
          </button>
        </div>

        {/* Car deleting flow */}
        {isConfirmingDelete ? (
          /* Confirmation screen */
          <div className="p-6 md:p-8 overflow-y-auto flex-1 flex flex-col justify-center items-center text-center space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center shadow-sm shrink-0">
              <TriangleAlert size={30} className="md:size-[32px]" />
            </div>
            <div className="space-y-1">
              <p className="text-slate-800 font-bold text-lg">Você tem certeza absoluta?</p>
              <p className="text-slate-500 text-sm max-w-sm mx-auto">
                O modelo <span className="font-semibold text-slate-700">{initialData?.modelName}</span> será permanentemente excluído da sua coleção.
              </p>
            </div>

            {/* Delete action buttons */}
            <div className="pt-4 flex gap-3 md:gap-4 w-full max-w-md mx-auto shrink-0">
              <button 
                id="cancel-delete"
                type="button"
                onClick={() => setIsConfirmingDelete(false)}
                className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors uppercase text-xs tracking-wider"
              >
                Não, voltar
              </button>
              <button 
                id="confirm-delete"
                type="button"
                onClick={handleDelete}
                className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-200 uppercase text-xs tracking-wider"
              >
                Sim, remover
              </button>
            </div>
          </div>
        ) : (
          /* Add/edit form */
          <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col overflow-hidden">
            
            {/* Form body - scrollable */}
            <div className="p-6 md:p-8 overflow-y-auto flex-1 space-y-5 md:space-y-6 content-fade">
              
              {/* Server validation error message */}
              {serverError && (
                <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl animate-in fade-in slide-in-from-top-2 duration-200">
                  <TriangleAlert size={20} className="shrink-0" />
                  <p className="text-sm font-medium">{serverError}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                {/* Car ID (hidden) */}
                <div className="hidden md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">ID do Registro</label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input id="register-id" {...register('id')} className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-orange-500 outline-none transition-all" />
                  </div>
                </div>
                
                {/* Model Name field */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Nome do Modelo <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input id="model-name" {...register('modelName', { required: true })} className="w-full pl-10 pr-4 py-2.5 md:py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-orange-500 outline-none transition-all text-sm md:text-base" placeholder="Ex: Nissan Skyline GT-R (R34)" />
                  </div>
                  {errors.modelName && <span className="text-xs text-red-500 mt-1 ml-1 block">Este campo é obrigatório.</span>}
                </div>

                {/* Model Code field */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Código do Modelo</label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input id="model-code" {...register('modelCode')} className="w-full pl-10 pr-4 py-2.5 md:py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-orange-500 outline-none transition-all text-sm md:text-base" placeholder="Ex: HNK34" />
                  </div>
                </div>

                {/* Collection Year field */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Ano de Lançamento</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input id="collection-year" {...register('collectionYear')} type="number" className="w-full pl-10 pr-4 py-2.5 md:py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-orange-500 outline-none transition-all text-sm md:text-base" placeholder="2024" />
                  </div>
                </div>

                {/* Serie / Collection field */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Série / Coleção</label>
                  <div className="relative">
                    <Layers className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input id="serie" {...register('serie')} className="w-full pl-10 pr-4 py-2.5 md:py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-orange-500 outline-none transition-all text-sm md:text-base" placeholder="Ex: J-Imports" />
                  </div>
                </div>

                {/* Color field */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Cor Predominante</label>
                  <div className="relative">
                    <Palette className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input id="color" {...register('color')} className="w-full pl-10 pr-4 py-2.5 md:py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-orange-500 outline-none transition-all text-sm md:text-base" placeholder="Ex: Bayside Blue" />
                  </div>
                </div>

                {/* Number in collection year field */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Número Anual</label>
                  <div className="relative">
                    <ListOrdered className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input id="number-in-year-collection" {...register('numberInYearCollection')} className="w-full pl-10 pr-4 py-2.5 md:py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-orange-500 outline-none transition-all text-sm md:text-base" placeholder="000/250" />
                  </div>
                </div>

                {/* Number in series field */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Número na Série</label>
                  <div className="relative">
                    <ListOrdered className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input id="number-in-serie" {...register('numberInSerie')} className="w-full pl-10 pr-4 py-2.5 md:py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-orange-500 outline-none transition-all text-sm md:text-base" placeholder="0/10" />
                  </div>
                </div>

                {/* Image URL field */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">URL da Imagem</label>
                  <div className="relative">
                    <FileImage className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input id="image-url" {...register('imageUrl')} className="w-full pl-10 pr-4 py-2.5 md:py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-orange-500 outline-none transition-all text-sm md:text-base" placeholder="https://example.com/image.jpg" />
                  </div>
                </div>
              </div>
            </div>

            {/* Form Footer - Separated and fixed at the bottom */}
            <div className="p-4 md:p-5 bg-slate-50 border-t border-slate-100 flex gap-3 md:gap-4 items-center shrink-0">
              {isEditing && (
                <button 
                  id="delete"
                  type="button"
                  onClick={() => setIsConfirmingDelete(true)}
                  className="text-red-500 font-bold hover:text-red-600 transition-colors p-2.5 rounded-xl hover:bg-red-50 shrink-0"
                  title="Remover carrinho"
                >
                  <Trash2 size={24} className="md:size-[26px]" />
                </button>
              )}
              
              <button 
                id="cancel"
                type="button"
                onClick={onClose}
                // Altura controlada no desktop e paddings mais discretos
                className="flex-1 h-12 md:h-11 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl md:rounded-2xl hover:bg-slate-50 transition-colors uppercase text-xs md:text-sm tracking-wider md:tracking-widest"
              >
                Cancelar
              </button>
              
              <button 
                id="save"
                type="submit"
                // Altura controlada no desktop e flex container para alinhar conteúdo
                className="flex-1 h-12 md:h-11 bg-orange-500 text-white font-bold rounded-xl md:rounded-2xl hover:bg-orange-600 transition-shadow shadow-lg shadow-orange-200 uppercase text-xs md:text-sm tracking-wider md:tracking-widest flex items-center justify-center gap-2"
              >
                {/* Ícone menor e proporcional ao texto no desktop */}
                <Save size={16} className="md:size-5" /> {isEditing ? 'Salvar' : 'Adicionar'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}