import { useState, useEffect } from 'react'

interface DogImage {
  message: string
  status: string
}

export default function Perritos() {
  const [dogUrl, setDogUrl] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')

  const fetchPerrito = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('https://dog.ceo/api/breeds/image/random')
      if (!response.ok) throw new Error('Error al cargar la imagen')
      const data: DogImage = await response.json()
      setDogUrl(data.message)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPerrito()
  }, [])

  return (
    <div className="card bg-base-200 shadow-xl w-80">
      <div className="card-body items-center text-center">
        <h2 className="card-title text-2xl mb-2">🐕 Perrito Aleatorio</h2>
        <p className="text-sm text-gray-500 mb-4">
          Usando <code>useEffect</code> + <code>useState</code>
        </p>
        <div className="w-64 h-64 rounded-xl overflow-hidden bg-base-300 flex items-center justify-center">
          {loading && <span className="loading loading-spinner loading-lg"></span>}
          {error && <p className="text-error text-sm px-4">{error}</p>}
          {!loading && !error && dogUrl && (
            <img src={dogUrl} alt="Perrito aleatorio" className="w-full h-full object-cover" />
          )}
        </div>
        <div className="card-actions mt-4">
          <button onClick={fetchPerrito} disabled={loading} className="btn btn-primary">
            {loading
              ? <span className="loading loading-spinner loading-sm"></span>
              : '¡Otro perrito! 🐾'}
          </button>
        </div>
      </div>
    </div>
  )
}



