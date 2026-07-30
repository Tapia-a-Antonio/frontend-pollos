import React, { useState } from 'react';
import { apiService } from '../services/apiService';
import{ Mail, Lock, LogIn, AlertCircle} from 'lucide-react';


export const Login = ({onLoginSuccess, onGoToRegister}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async(e) =>{
        e.preventDefault();
        setError('');
        setLoading(true);

        try{
            const data = await apiService.login(username, password);
            onLoginSuccess(data);
        }catch(err){
            setError(err.message || 
                'Credenciales invalidas. Verifica tu correo o pass');
        }finally{
            setLoading(false);
        }
    };

    return(
        <div className="max-w-lg w-full mx-auto my-12 bg-white 
        rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-indigo-800 to-indigo-900 
                px-6 py-6 text-center text-white">
                <h2 className="text-2xl font-bold">¡Bienvenido de nuevo!</h2>
                <p className="text-indigo-200 mt-1 text-sm">Inicia sesion 
                    en tu cuenta de MercaditoLibre</p>
               
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl flex 
                            items-start gap-2.5 border border-red-200 text-sm">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
            </div>
            )}

        {/* Campo Correo */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Correo Electrónico</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="pl-11 w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-900"
              placeholder="nombre@correo.com"
            />
          </div>
        </div>

        {/* Campo Contraseña */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Contraseña</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pl-11 w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-900"
              placeholder="••••••••"
            />
          </div>
        </div>

        {/* Botón Entrar */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 cursor-pointer"
        >
          <LogIn className="w-5 h-5" />
          {loading ? 'Iniciando Sesión...' : 'Entrar'}
        </button>

        {/* Enlace al registro */}
        <div className="text-center text-sm text-gray-500 border-t border-gray-100 pt-6">
          ¿No tienes una cuenta?{' '}
          <button
            type="button"
            onClick={onGoToRegister}
            className="text-indigo-600 font-bold hover:underline"
          >
            Regístrate ahora
          </button>
        </div>
      </form>

        </div>
    );
};