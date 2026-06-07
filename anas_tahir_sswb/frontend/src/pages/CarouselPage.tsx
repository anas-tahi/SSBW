import { useState, useCallback, useEffect } from 'react';
import useSWR from 'swr';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Header from '../components/Header';

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

const CarouselPage = () => {
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

  // Fetch products using SWR
  const { data: products, error, isLoading } = useSWR<Product[]>('/api/productos?limit=20', async (url: string) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}${url}`);
    if (!response.ok) throw new Error('Failed to fetch products');
    const data = await response.json();
    return data.data || data;
  });

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

  if (error) {
    return (
      <div className="min-h-screen bg-prado-light flex items-center justify-center">
        <div className="text-center">
          <p className="text-prado-red text-xl mb-4">Error loading products</p>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  if (isLoading || !products) {
    return (
      <div className="min-h-screen bg-prado-light flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-prado-red"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-prado-light">
      <Header />
      
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-prado-dark mb-4">
            Our <span className="text-prado-red">Collection</span>
          </h2>
          <p className="text-xl text-gray-600">
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
                        src={product.imagen || '/placeholder-art.jpg'}
                        alt={product.título}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-art.jpg';
                        }}
                      />
                      <div className="absolute top-4 right-4 bg-prado-red text-white px-3 py-1 rounded-full text-sm font-semibold">
                        €{product.precio.toLocaleString()}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-prado-dark mb-2">{product.título}</h3>
                      <p className="text-gray-600 mb-1">Artist: {product.artista || 'Unknown'}</p>
                      <p className="text-gray-500 mb-4">{product.técnica || 'Technique not specified'}</p>
                      <p className="text-gray-600 line-clamp-3 mb-4">{product.descripción}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-prado-red text-2xl font-bold">€{product.precio.toLocaleString()}</span>
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
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-prado-dark rounded-full p-3 backdrop-blur-sm border border-gray-200 shadow-lg"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-prado-dark rounded-full p-3 backdrop-blur-sm border border-gray-200 shadow-lg"
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
                    ? 'bg-prado-red w-8'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="mb-12">
          <h3 className="text-3xl font-bold text-prado-dark text-center mb-8">All Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="card bg-white border border-gray-200 hover:border-prado-red transition-all hover:transform hover:scale-105 hover:shadow-lg">
                <figure className="aspect-video bg-gray-100">
                  <img
                    src={product.imagen || '/placeholder-art.jpg'}
                    alt={product.título}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-art.jpg';
                    }}
                  />
                </figure>
                <div className="card-body">
                  <h3 className="card-title text-prado-dark text-lg">{product.título}</h3>
                  <p className="text-gray-600 text-sm mb-2">{product.artista || 'Unknown'}</p>
                  <div className="card-actions justify-between">
                    <span className="text-prado-red font-bold">€{product.precio.toLocaleString()}</span>
                    <button className="btn btn-outline btn-sm border-prado-red text-prado-red hover:bg-prado-red hover:text-white">
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
      <footer className="bg-prado-dark text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-400">
            <p>&copy; 2024 Tienda Prado. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CarouselPage;



