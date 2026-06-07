import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, MapPin, Calendar, LogOut } from 'lucide-react';
import Header from '../components/Header';

interface UserProfile {
  email: string;
  nombre: string;
  telefono?: string;
  direccion?: string;
  fecha_nacimiento?: string;
  genero?: string;
  biografia?: string;
  idioma?: string;
  newsletter: boolean;
  admin: boolean;
}

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    direccion: '',
    biografia: '',
    idioma: 'es',
    newsletter: false,
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/profile`, {
        credentials: 'include',
      });
      if (response.ok) {
        // For now, we'll use a mock user since the backend returns HTML
        setUser({
          email: 'user@example.com',
          nombre: 'User Name',
          telefono: '+34 600 000 000',
          direccion: '123 Main St',
          fecha_nacimiento: '1990-01-01',
          genero: 'other',
          biografia: 'Art enthusiast',
          idioma: 'es',
          newsletter: true,
          admin: false,
        });
        setFormData({
          nombre: 'User Name',
          telefono: '+34 600 000 000',
          direccion: '123 Main St',
          biografia: 'Art enthusiast',
          idioma: 'es',
          newsletter: true,
        });
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/logout`, {
        credentials: 'include',
      });
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setEditing(false);
        fetchProfile();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-prado-light">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-prado-red"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-prado-light">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-prado-dark">My Profile</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-prado-red hover:text-red-700"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {editing ? (
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-prado-red"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-prado-red"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.direccion}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-prado-red"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  value={formData.biografia}
                  onChange={(e) => setFormData({ ...formData, biografia: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-prado-red"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="newsletter"
                  checked={formData.newsletter}
                  onChange={(e) => setFormData({ ...formData, newsletter: e.target.checked })}
                  className="w-4 h-4 text-prado-red border-gray-300 rounded focus:ring-prado-red"
                />
                <label htmlFor="newsletter" className="text-sm text-gray-700">
                  Subscribe to newsletter
                </label>
              </div>

              <div className="flex gap-4">
                <button type="submit" className="btn-primary">
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
                <div className="w-20 h-20 bg-prado-red rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user.nombre.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-prado-dark">{user.nombre}</h2>
                  <p className="text-gray-600">{user.email}</p>
                  {user.admin && (
                    <span className="inline-block mt-1 px-2 py-1 bg-prado-red text-white text-xs rounded">
                      Admin
                    </span>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-prado-dark">{user.telefono || 'Not provided'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="text-prado-dark">{user.direccion || 'Not provided'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Birthday</p>
                    <p className="text-prado-dark">{user.fecha_nacimiento || 'Not provided'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="text-prado-dark">{user.genero || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {user.biografia && (
                <div className="pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-2">Bio</p>
                  <p className="text-prado-dark">{user.biografia}</p>
                </div>
              )}

              <div className="pt-6 border-t border-gray-200">
                <button
                  onClick={() => setEditing(true)}
                  className="btn-primary"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



