// Tarea 12: Carrousel React con props (SSG) — sin API, imágenes pasadas como props
import { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

interface Producto {
  título: string;
  descripción: string;
  texto_precio: string;
  imagen: string;
}

interface Props {
  productos: Producto[];
}

const CarrouselSSG = ({ productos }: Props) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'center' },
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    onSelect();
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-white text-center mb-10 font-garamond tracking-widest">
          Galería de Imágenes
        </h2>

        {/* Embla Carousel */}
        <div className="relative mb-10">
          <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
            <div className="flex">
              {productos.map((p, i) => (
                <div key={i} className="flex-[0_0_100%] min-w-0 px-4">
                  <div className="bg-white rounded-2xl overflow-hidden">
                    <img
                      src={`/images/${p.imagen}`}
                      alt={p.título}
                      className="w-full h-72 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Tienda+Prado';
                      }}
                    />
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{p.título}</h3>
                      <p className="text-red-600 font-semibold">{p.texto_precio}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={scrollPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={scrollNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg">
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-4">
            {productos.map((_, i) => (
              <button key={i} onClick={() => emblaApi?.scrollTo(i)}
                className={`h-2 rounded-full transition-all ${i === selectedIndex ? 'bg-red-500 w-8' : 'bg-gray-400 w-2'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarrouselSSG;
