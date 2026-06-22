import React, { useState } from 'react';
import { PROJECTS } from '../data';
import { PropertyType } from '../types';
import { MapPin, Sun, HelpCircle, DollarSign, Cpu } from 'lucide-react';

export default function ProjectsGallery() {
  const [filter, setFilter] = useState<string>('all');

  const filteredProjects = PROJECTS.filter(project => {
    if (filter === 'all') return true;
    return project.propertyType === filter;
  });

  return (
    <section id="projects-section" className="py-20 bg-zinc-50 border-y border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Gallery Header */}
        <div className="flex flex-col md:flex-row items-stretch md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs font-bold tracking-widest text-[#00DB4A] uppercase px-3 py-1 bg-[#00DB4A]/10 rounded-full">
              Cases de Sucesso
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-zinc-900 tracking-tight mt-3">
              Projetos Realizados de Destaque
            </h2>
            <p className="text-sm text-zinc-500 mt-2 max-w-lg">
              Veja a transformação de clientes que confiaram na IGREEN e hoje usufruem de autonomia energética máxima e poluição zero.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex bg-zinc-200/50 p-1 rounded-2xl self-start md:self-end">
            {['all', 'residencial', 'comercial', 'rural'].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                  filter === type
                    ? 'bg-zinc-900 text-white shadow-sm'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {type === 'all' ? 'Ver Todos' : type}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-3xl overflow-hidden border border-zinc-150 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row"
            >
              {/* Left Column Photo */}
              <div className="sm:w-1/2 aspect-square sm:aspect-auto h-48 sm:h-auto overflow-hidden relative bg-zinc-200">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-103 transition duration-500"
                />
                
                {/* Floating City Sticker */}
                <div className="absolute top-4 left-4 inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur shadow text-xs font-semibold text-zinc-800">
                  <MapPin className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                  <span>{project.city} - SP</span>
                </div>
              </div>

              {/* Right Column Specs details */}
              <div className="p-6 sm:w-1/2 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                    {project.systemType}
                  </span>
                  
                  <h3 className="text-lg font-display font-bold text-zinc-900 mt-1 leading-tight">
                    {project.title}
                  </h3>

                  <p className="text-xs text-zinc-500 mt-2.5 line-clamp-3 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Technical stats container */}
                <div className="mt-6 pt-4 border-t border-zinc-100 grid grid-cols-2 gap-2 text-left">
                  <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-100">
                    <span className="text-[9px] font-medium text-zinc-400 uppercase block">Potência Pico</span>
                    <span className="text-xs font-black text-zinc-800 block mt-0.5 font-display flex items-center gap-1">
                      <Cpu className="w-3.5 h-3.5 text-emerald-600" />
                      {project.powerkWp}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
                    <span className="text-[9px] font-bold text-emerald-700 uppercase block">Economia/mês</span>
                    <span className="text-xs font-black text-emerald-700 block mt-0.5">
                      R$ {project.monthlyEconomy}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
