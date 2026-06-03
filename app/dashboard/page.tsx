'use client';

import { useEffect, useState } from 'react';
import { Car, Search, Plus, Calendar, Palette, ListOrdered, Frown } from 'lucide-react';
import { CarFormData } from '../types/Car';
import { signOut } from '../auth/logout/action';
import { getCarsInCollection } from './actions';
import CarModal from './CarModal';

export default function HotWheelsDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [carCollection, setCarCollection] = useState<CarFormData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<CarFormData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCarsInCollection() {
      try {
        const carsInCollection = await getCarsInCollection();
        if ('success' in carsInCollection) {
          console.error("Erro ao carregar coleção:", carsInCollection.error);
          return;
        }
        setCarCollection(carsInCollection);
      } finally {
        setLoading(false);
      }
    }

    fetchCarsInCollection();
  }, []);

  // Deriving the list of cars from car collection and search term, to avoid filtering on every render
  const filteredCars = carCollection.filter((car) =>
    car.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.modelCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFormSuccess = (newData: CarFormData, isEditing: boolean) => {
    if (isEditing) {
      setCarCollection((prev) =>
        prev.map((car) => car.id === newData.id ? newData : car)
      );
    } else {
      setCarCollection((prev) => [newData, ...prev]);
    }
  };

  const handleDeleteSuccess = (deletedId: string) => {
    setCarCollection((prev) => prev.filter(car => car.id !== deletedId));
    setIsModalOpen(false);
    setSelectedCar(null);
  };

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
            id="search"
              type="text" 
              placeholder="Buscar por modelo ou código..." 
              className="pl-10 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-orange-500 outline-none transition-all w-full md:w-80 shadow-sm"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button id="add-new-car" onClick={() => {setSelectedCar(null); setIsModalOpen(true);}} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors flex items-center gap-2 shadow-lg">
            <Plus size={20} /> Adicionar
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">
            Minha Garagem | 
            <button id="sign-out" onClick={signOut} 
                className="text-xl ml-2 mb-2 font-bold text-slate-700 hover:text-orange-600 transition-colors uppercase">
                Sair da Garagem
              </button>
          </h2>
          <p className="text-slate-500">Você tem {carCollection.length} carrinhos na coleção</p>
        </div>
      </div>

      <div id="car-list" className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full flex items-center justify-center py-20">
            <Car size={128} className="text-slate-300 animate-pulse" />
          </div>
        ) : carCollection.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4">
            <Car size={128} className="text-slate-300" />
            <p className="text-slate-500">Sua garagem está vazia. Adicione seu primeiro carrinho!</p>
          </div>
        ) : filteredCars.length === 0 ? (
          // If the search term is not empty and there are no cars matching the search, show a message
          <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4">
            <Frown size={128} className="text-slate-300" />
            <p className="text-slate-500 text-center">
              Nenhum carrinho encontrado para "<span className="font-semibold text-slate-700">{searchTerm}</span>".
            </p>
          </div>
        ) : (
          // Map through the filtered list of cars instead of the entire collection
          filteredCars.map((car) => (
            <div key={car.id} className="bg-white rounded-3xl border-2 border-slate-100 shadow-xl overflow-hidden flex flex-col hover:border-orange-200 transition-all">
              {/* Top Bar */}
              <div className="bg-slate-900 p-4 flex justify-between items-center z-10">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Código: {car.modelCode}</span>
                <span className="text-orange-500 font-black text-sm italic">{car.numberInYearCollection}</span>
              </div>

              {/* Car picture */}
              <div className="h-44 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center relative group">
                {car.imageUrl ? (
                  <img src={car.imageUrl} alt={car.modelName} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <Car size={80} className="text-slate-300 group-hover:text-orange-400 group-hover:scale-110 transition-all duration-500" />
                )}
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold shadow-sm">
                  SERIE: {car.serie.toUpperCase()}
                </div>
              </div>

              {/* Car data */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-slate-800 leading-tight mb-1">{car.modelName}</h2>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Palette size={14} />
                    <span className="text-xs font-medium uppercase tracking-wider">{car.color}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-auto">
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                      <Calendar size={14} />
                      <span className="text-[10px] font-bold uppercase">Ano</span>
                    </div>
                    <span className="text-sm font-bold text-slate-700">{car.collectionYear}</span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                      <ListOrdered size={14} />
                      <span className="text-[10px] font-bold uppercase">Na Série</span>
                    </div>
                    <span className="text-sm font-bold text-slate-700">{car.numberInSerie}</span>
                  </div>
                </div>
              </div>

              {/* Card footer */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button onClick={() => {
                  setSelectedCar(car);
                  setIsModalOpen(true);}} 
                  className="text-xs font-bold text-slate-600 hover:text-orange-600 transition-colors uppercase">
                  Editar Registro
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Car add/edit modal component */}
      <CarModal 
        isOpen={isModalOpen} 
        initialData={selectedCar} 
        onClose={() => {setIsModalOpen(false); setSelectedCar(null);}}
        onSuccess={handleFormSuccess}
        onDeleteSuccess={handleDeleteSuccess}
      />
    </div>
  );
}
