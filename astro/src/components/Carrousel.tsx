import { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

interface Product {
  id: number;
  título: string;
  descripción: string;
  precio: number;
  imagen: string;
  artista: string;
  año: number;
  técnica: string;
}

const Carrousel = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'center',
      slidesToScroll: 1,
      containScroll: 'trimSnaps',
    },
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
  );

  // Sample products data (in real app, this would come from API)
  const products: Product[] = [
    {
      id: 1,
      título: "Las Meninas",
      descripción: "Diego Velázquez's masterpiece depicting the Infanta Margarita Teresa surrounded by her entourage.",
      precio: 150000,
      imagen: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&h=600&fit=crop",
      artista: "Diego Velázquez",
      año: 1656,
      técnica: "Oil on canvas"
    },
    {
      id: 2,
      título: "The Garden of Earthly Delights",
      descripción: "Hieronymus Bosch's triptych depicting paradise, earthly delights, and hell.",
      precio: 200000,
      imagen: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&h=600&fit=crop",
      artista: "Hieronymus Bosch",
      año: 1490,
      técnica: "Oil on oak panel"
    },
    {
      id: 3,
      título: "The Third of May 1808",
      descripción: "Francisco Goya's depiction of the executions by French soldiers in Madrid.",
      precio: 180000,
      imagen: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&h=600&fit=crop",
      artista: "Francisco Goya",
      año: 1814,
      técnica: "Oil on canvas"
    },
    {
      id: 4,
      título: "The Annunciation",
      descripción: "Fra Angelico's Renaissance masterpiece depicting the angel Gabriel announcing to Mary.",
      precio: 120000,
      imagen: "https://images.unsplash.com/photo-1577720643272-265f09367456?w=800&h=600&fit=crop",
      artista: "Fra Angelico",
      año: 1440,
      técnica: "Fresco"
    },
    {
      id: 5,
      título: "The Surrender of Breda",
      descripción: "Diego Velázquez's depiction of the surrender of the Dutch city of Breda to Spanish troops.",
      precio: 160000,
      imagen: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=800&h=600&fit=crop",
      artista: "Diego Velázquez",
      año: 1635,
      técnica: "Oil on canvas"
    }
  ];

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on('select', onSelect);
    onSelect();

    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-white mb-4">
            Our <span className="text-red-400">Collection</span>
          </h2>
          <p className="text-xl text-gray-300">
            Explore masterpieces from renowned artists
          </p>
        </div>

        {/* Embla Carousel */}
        <div className="relative max-w-6xl mx-auto mb-16">
          <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
            <div className="flex">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex-[0_0_100%] min-w-0 px-4"
                >
                  <div className="bg-white rounded-2xl overflow-hidden border border-gray-200">
                    <div className="aspect-video bg-gray-100 relative">
                      <img
                        src={product.imagen}
                        alt={product.título}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        €{product.precio.toLocaleString()}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{product.título}</h3>
                      <p className="text-gray-600 mb-1">Artist: {product.artista}</p>
                      <p className="text-gray-500 mb-4">{product.técnica}</p>
                      <p className="text-gray-600 line-clamp-3 mb-4">{product.descripción}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-red-500 text-2xl font-bold">€{product.precio.toLocaleString()}</span>
                        <button className="btn btn-primary">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={scrollPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 rounded-full p-3 backdrop-blur-sm border border-gray-200 shadow-lg"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 rounded-full p-3 backdrop-blur-sm border border-gray-200 shadow-lg"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-2 mt-6">
            {products.map((_, index) => (
              <button
                key={index}
                onClick={() => emblaApi?.scrollTo(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === selectedIndex
                    ? 'bg-red-500 w-8'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="mb-12">
          <h3 className="text-3xl font-bold text-white text-center mb-8">All Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="card bg-white border border-gray-200 hover:border-red-500 transition-all hover:transform hover:scale-105 hover:shadow-lg">
                <figure className="aspect-video bg-gray-100">
                  <img
                    src={product.imagen}
                    alt={product.título}
                    className="w-full h-full object-cover"
                  />
                </figure>
                <div className="card-body">
                  <h3 className="card-title text-gray-900 text-lg">{product.título}</h3>
                  <p className="text-gray-600 text-sm mb-2">{product.artista}</p>
                  <div className="card-actions justify-between">
                    <span className="text-red-500 font-bold">€{product.precio.toLocaleString()}</span>
                    <button className="btn btn-outline btn-sm border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-400">
            <p>&copy; 2024 Tienda Prado. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Carrousel;
