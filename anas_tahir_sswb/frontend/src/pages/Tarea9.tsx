// Tarea 9: SPA con Vite, React y Tailwind
// Dos componentes: Perritos (useEffect/useState) y Cuadros (useSWR)
import Header from '../components/Header'
import Perritos from '../components/Perritos'
import Cuadros from '../components/Cuadros'

export default function Tarea9() {
  return (
    <div className="min-h-screen bg-prado-light">
      <Header />
      <div className="flex gap-8 items-center justify-center min-h-[80vh] font-sans p-8 flex-wrap">
        <Perritos />
        <Cuadros />
      </div>
    </div>
  )
}



