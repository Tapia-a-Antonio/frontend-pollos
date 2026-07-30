import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { User, Mail, Phone, MapPin, Edit3, Save, X, Loader2, AlertCircle } from 'lucide-react';

export const PerfilUsuario = ({ user }) => {
    const [cliente, setCliente] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState('');
    
    // Estado para los campos del formulario
    const [formData, setFormData] = useState({ nombre: '', telefono: '', direccion: '' });

    useEffect(() => {
        const cargarPerfil = async () => {
            if (!user || !user.username) return;
            try {
                // Buscamos todos los clientes y filtramos el que coincide con el correo logueado
                const clientes = await apiService.getClientes();
                const miPerfil = clientes.find(c => c.email === user.username);
                
                if (miPerfil) {
                    setCliente(miPerfil);
                    setFormData({
                        nombre: miPerfil.nombre || '',
                        telefono: miPerfil.telefono || '',
                        direccion: miPerfil.direccion || ''
                    });
                } else {
                    setError('No se encontraron los datos adicionales del perfil.');
                }
            } catch (err) {
                setError('Error al conectar con el servidor.');
            } finally {
                setCargando(false);
            }
        };
        cargarPerfil();
    }, [user]);

    const handleSave = async (e) => {
        e.preventDefault();
        setGuardando(true);
        setError('');
        try {
            // Actualizamos enviando toda la data esperada por el backend
            const datosActualizados = {
                ...cliente,
                nombre: formData.nombre,
                telefono: formData.telefono,
                direccion: formData.direccion
            };
            
            const respuesta = await apiService.actualizarCliente(cliente.id, datosActualizados);
            setCliente(respuesta);
            setEditMode(false);
            
            // Actualizar el nombre en localStorage por si se cambió
            localStorage.setItem('nombre', respuesta.nombre);
        } catch (err) {
            setError(err.message || 'Error al actualizar el perfil.');
        } finally {
            setGuardando(false);
        }
    };

    if (cargando) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
                <p className="text-gray-500 mt-4 font-medium">Cargando tu perfil...</p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                {/* Cabecera del Perfil */}
                <div className="bg-gradient-to-r from-indigo-800 to-indigo-600 px-8 py-10 text-white flex justify-between items-start">
                    <div className="flex items-center gap-5">
                        <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                            <User className="w-10 h-10 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold">{cliente ? cliente.nombre : user?.nombre}</h1>
                            <p className="text-indigo-100 mt-1 flex items-center gap-2">
                                <Mail className="w-4 h-4" /> {user?.username}
                            </p>
                        </div>
                    </div>
                    {cliente && !editMode && (
                        <button 
                            onClick={() => setEditMode(true)}
                            className="bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold backdrop-blur-sm cursor-pointer"
                        >
                            <Edit3 className="w-4 h-4" /> Editar Perfil
                        </button>
                    )}
                </div>

                {/* Cuerpo del Perfil */}
                <div className="p-8">
                    {error && (
                        <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-xl flex items-start gap-2.5 border border-red-200 text-sm">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {!cliente ? (
                        <p className="text-gray-500 text-center py-8">Tu cuenta de administrador no tiene un perfil de cliente asociado.</p>
                    ) : (
                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Campo Nombre */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                        <User className="w-4 h-4 text-indigo-500" /> Nombre Completo
                                    </label>
                                    <input 
                                        type="text"
                                        value={formData.nombre}
                                        onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                                        disabled={!editMode}
                                        required
                                        className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                                    />
                                </div>

                                {/* Campo Correo (No editable) */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-indigo-500" /> Correo Electrónico
                                    </label>
                                    <input 
                                        type="email"
                                        value={cliente.email}
                                        disabled
                                        className="w-full p-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 outline-none cursor-not-allowed"
                                    />
                                </div>

                                {/* Campo Teléfono */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-indigo-500" /> Teléfono
                                    </label>
                                    <input 
                                        type="tel"
                                        value={formData.telefono}
                                        onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                                        disabled={!editMode}
                                        placeholder="Agrega un teléfono"
                                        className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                                    />
                                </div>

                                {/* Campo Dirección */}
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-indigo-500" /> Dirección de Envío
                                    </label>
                                    <textarea 
                                        value={formData.direccion}
                                        onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                                        disabled={!editMode}
                                        rows="3"
                                        placeholder="Agrega tu dirección completa"
                                        className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all resize-none"
                                    />
                                </div>
                            </div>

                            {/* Botones de acción al editar */}
                            {editMode && (
                                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            setEditMode(false);
                                            // Restaurar datos originales
                                            setFormData({ nombre: cliente.nombre, telefono: cliente.telefono, direccion: cliente.direccion });
                                        }}
                                        className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                                    >
                                        Cancelar
                                    </button>
                                    <button 
                                        type="submit"
                                        disabled={guardando}
                                        className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                                    >
                                        {guardando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                        Guardar Cambios
                                    </button>
                                </div>
                            )}
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};