import useSWR from 'swr'

interface Producto {
  id: number
  título: string
  precio: number
  imagen: string
}

interface ApiResponse {
  success: boolean
  data: Producto[]
}

const fetcher = (url: string) =>
  fetch(url).then(res => {
    if (!res.ok) throw new Error('Error al cargar los datos')
    return res.json()
  })

function getProductoAleatorio(productos: Producto[]): Producto {
  return productos[Math.floor(Math.random() * productos.length)]
}

export default function Cuadros() {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse>(
    'http://localhost:3000/api/productos?limit=50',
    fetcher
  )

  const Recarga = () => { mutate() }

  const productos = data?.data || []
  const producto = productos.length > 0 ? getProductoAleatorio(productos) : null

  return (
    <div className="card bg-base-200 shadow-xl w-80">
      <div className="card-body items-center text-center">
        <h2 className="card-title text-2xl mb-2">🎨 Cuadro Aleatorio</h2>
        <p className="text-sm text-gray-500 mb-4">
          Usando <code>useSWR</code>
        </p>
        <div className="w-64 h-64 rounded-xl overflow-hidden bg-base-300 flex items-center justify-center">
          {isLoading && <span className="loading loading-spinner loading-lg"></span>}
          {error && <p className="text-error text-sm px-4">{error.message}</p>}
          {!isLoading && !error && producto && (
            <img
              src={`http://localhost:3000/imagenes/${producto.imagen}`}
              alt={producto.título}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://placehold.co/256x256?text=Sin+imagen'
              }}
            />
          )}
        </div>
        {!isLoading && !error && producto && (
          <div className="mt-2 text-sm">
            <p className="font-semibold truncate w-64">{producto.título}</p>
            <p className="text-primary font-bold">{Number(producto.precio).toFixed(2)} €</p>
          </div>
        )}
        <div className="card-actions mt-4">
          <button
            onClick={Recarga}
            disabled={isLoading}
            className="font-bold cursor-pointer bg-amber-100 hover:bg-amber-200 text-gray-600 p-4 rounded-2xl transition-colors"
          >
            {isLoading
              ? <span className="loading loading-spinner loading-sm"></span>
              : <span>¡Otro! <span>🎨</span></span>}
          </button>
        </div>
      </div>
    </div>
  )
}
