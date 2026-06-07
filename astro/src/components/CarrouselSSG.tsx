import { useState, useCallback, useEffect } from 'react';
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
    <div style={{minHeight:'100vh', background:'#1a1a2e', padding:'3rem 1rem'}}>
      <div style={{maxWidth:'900px', margin:'0 auto'}}>
        <h2 style={{color:'white', textAlign:'center', fontSize:'2.5rem', marginBottom:'2rem'}}>
          Galeria de Imagenes
        </h2>
        <div style={{position:'relative'}}>
          <div style={{overflow:'hidden', borderRadius:'1rem'}} ref={emblaRef}>
            <div style={{display:'flex'}}>
              {productos.map((p, i) => (
                <div key={i} style={{flex:'0 0 100%', minWidth:0, padding:'0 1rem'}}>
                  <div style={{background:'white', borderRadius:'1rem', overflow:'hidden'}}>
                    <img
                      src={"/images/" + p.imagen}
                      alt={p.título}
                      style={{width:'100%', height:'300px', objectFit:'cover'}}
                      onError={(e) => { (e.target as HTMLImageElement).src='https://via.placeholder.com/800x400?text=Tienda+Prado'; }}
                    />
                    <div style={{padding:'1.5rem'}}>
                      <h3 style={{fontWeight:'bold', marginBottom:'0.5rem'}}>{p.título}</h3>
                      <p style={{color:'#c0392b', fontWeight:'600'}}>{p.texto_precio}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button onClick={scrollPrev}
            style={{position:'absolute', left:'0.5rem', top:'50%', transform:'translateY(-50%)',
              background:'rgba(255,255,255,0.9)', border:'none', borderRadius:'50%',
              width:'3rem', height:'3rem', cursor:'pointer', fontSize:'1.2rem'}}>
            &#8249;
          </button>
          <button onClick={scrollNext}
            style={{position:'absolute', right:'0.5rem', top:'50%', transform:'translateY(-50%)',
              background:'rgba(255,255,255,0.9)', border:'none', borderRadius:'50%',
              width:'3rem', height:'3rem', cursor:'pointer', fontSize:'1.2rem'}}>
            &#8250;
          </button>
        </div>
        <div style={{display:'flex', justifyContent:'center', gap:'0.5rem', marginTop:'1rem'}}>
          {productos.map((_, i) => (
            <button key={i} onClick={() => emblaApi?.scrollTo(i)}
              style={{width: i===selectedIndex ? '2rem' : '0.5rem', height:'0.5rem',
                borderRadius:'999px', border:'none', cursor:'pointer',
                background: i===selectedIndex ? '#e74c3c' : '#888',
                transition:'all 0.3s'}} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CarrouselSSG;
