'use client';

import React, { useState } from 'react';
import { Car, Search, Plus, Hash, Calendar, Layers, Palette, ListOrdered } from 'lucide-react';
import CarModal from '../components/CarModal';
import { CarFormData } from '../types/Car.types';

// Dados com a nova estrutura detalhada
const hotWheelsCollection = [
  { 
    id: 1, 
    modelo: 'Nissan Skyline GT-R (R34)', 
    codigoModelo: 'HNK34', 
    ano: 2024, 
    serie: 'J-Imports', 
    cor: 'Bayside Blue',
    numColecaoAnual: '42/250',
    numNaSerie: '4/10'
  },
  { 
    id: 2, 
    modelo: 'Toyota Supra', 
    codigoModelo: 'GRK55', 
    ano: 2023, 
    serie: 'Then and Now', 
    cor: 'Renaissance Red',
    numColecaoAnual: '112/250',
    numNaSerie: '2/10'
  },
  { 
    id: 3, 
    modelo: 'Porsche 911 GT3', 
    codigoModelo: 'HNJ88', 
    ano: 2024, 
    serie: 'Factory Fresh', 
    cor: 'Shark Blue',
    numColecaoAnual: '05/250',
    numNaSerie: '1/10'
  }
];

export default function HotWheelsDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<CarFormData | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 text-slate-900">
      <header className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black italic text-slate-900 tracking-tighter uppercase">
            HW <span className="text-orange-500">Collector</span>
          </h1>
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Buscar por modelo ou código..." 
              className="pl-10 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-orange-500 outline-none transition-all w-full md:w-80 shadow-sm"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={() => {setSelectedCar(null); setIsModalOpen(true);}} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors flex items-center gap-2 shadow-lg">
            <Plus size={20} /> Adicionar
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">
            Minha Garagem
          </h2>
          <p className="text-slate-500">Você tem {hotWheelsCollection.length} carrinhos na coleção</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {hotWheelsCollection
          .filter(car => car.modelo.toLowerCase().includes(searchTerm.toLowerCase()) || car.codigoModelo.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((car) => (
          <div key={car.id} className="bg-white rounded-3xl border-2 border-slate-100 shadow-xl overflow-hidden flex flex-col hover:border-orange-200 transition-all">
            {/* Top Bar - Representando a embalagem */}
            <div className="bg-slate-900 p-4 flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Código: {car.codigoModelo}</span>
              <span className="text-orange-500 font-black text-sm italic">{car.numColecaoAnual}</span>
            </div>

            {/* Area da "Foto" */}
            <div className="h-44 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center relative group">
              <Car size={80} className="text-slate-300 group-hover:text-orange-400 group-hover:scale-110 transition-all duration-500" />
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold shadow-sm">
                SERIE: {car.serie.toUpperCase()}
              </div>
            </div>

            {/* Informações */}
            <div className="p-6 flex-1 flex flex-col">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-slate-800 leading-tight mb-1">{car.modelo}</h2>
                <div className="flex items-center gap-2 text-slate-400">
                  <Palette size={14} />
                  <span className="text-xs font-medium uppercase tracking-wider">{car.cor}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-auto">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                    <Calendar size={14} />
                    <span className="text-[10px] font-bold uppercase">Ano</span>
                  </div>
                  <span className="text-sm font-bold text-slate-700">{car.ano}</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                    <ListOrdered size={14} />
                    <span className="text-[10px] font-bold uppercase">Na Série</span>
                  </div>
                  <span className="text-sm font-bold text-slate-700">{car.numNaSerie}</span>
                </div>
              </div>
            </div>

            {/* Footer do Card */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button onClick={() => {
                setSelectedCar(car);
                setIsModalOpen(true);}} 
                className="text-xs font-bold text-slate-600 hover:text-orange-600 transition-colors uppercase">
                Editar Registro
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Adição de Carro */}
      <CarModal isOpen={isModalOpen} initialData={selectedCar} onClose={() => {setIsModalOpen(false); setSelectedCar(null);}} />
    </div>
  );
}