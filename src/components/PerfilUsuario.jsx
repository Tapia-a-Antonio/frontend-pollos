import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { User, Mail, Phone, MapPin, Edit3, Save, Loader2, AlertCircle, Key, CheckCircle2 } from 'lucide-react';

export const PerfilUsuario = ({ user }) => {
    const [cliente, setCliente] = useState(null);
    const [cargando, setCargando] = useState(true);
    
    // Estados para Perfil
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({ nombre: '', telefono: '', direccion: '' });
    const [guardandoPerfil, setGuardandoPerfil] = useState(false);
    const [msgPerfil, setMsgPerfil] = useState({ type: '', text: '' });

    // Estados para Contraseña
    const [passData, setPassData] = useState({ actual: '', nueva: '', confirmar: '' });
    const [guardandoPass, setGuardandoPass] = useState(false);
    const [msgPass, setMsgPass] = useState({ type: '', text: '' });

    useEffect(() => {
        const cargarPerfil = async () => {
            if (!user || !user.username) return;
            try {
                if (user.rol === 'ROLE_CLIENTE') {
                    const clientes = await apiService.getClientes();
                    const miPerfil = clientes.find(c => c.email === user.username);
                    if (miPerfil) {
                        setCliente(miPerfil);
                        setFormData({ 
                            nombre: miPerfil.nombre || '', 
                            telefono: miPerfil.telefono || '', 
                            direccion: miPerfil.direccion || '' 
                        });
                    }
                } else {
                    // Si es Admin, solo pre-cargamos su nombre
                    setFormData({ nombre: user.nombre, telefono: '', direccion: '' });
                }
            } catch (err) {
                setMsgPerfil({ type: 'error', text: 'Error al conectar con el servidor.' });
            } finally {
                setCargando(false);
            }
        };
        cargarPerfil();
    }, [user]);

    const handleSavePerfil = async (e) => {
        e.preventDefault();
        setGuardandoPerfil(true);
        setMsgPerfil({ type: '', text: '' });
        
        try {
            // 1. Todos pueden actualizar su nombre en la tabla 'usuarios'
            await apiService.actualizarPerfilUsuario(user.username, formData.nombre);
            
            // 2. Si es cliente, sincronizamos también la tabla 'clientes'
            if (user.rol === 'ROLE_CLIENTE' && cliente) {
                const datosActualizados = { ...cliente, nombre: formData.nombre, telefono: formData.telefono, direccion: formData.direccion };
                const respuesta = await apiService.actualizarCliente(cliente.id, datosActualizados);
                setCliente(respuesta);
            }

            localStorage.setItem('nombre', formData.nombre); // Actualizar cache local
            setMsgPerfil({ type: 'success', text: 'Perfil actualizado correctamente.' });
            setEditMode(false);
        } catch (err) {
            setMsgPerfil({ type: 'error', text: err.message || 'Error al actualizar el perfil.' });
        } finally {
            setGuardandoPerfil(false);
        }
    };

    const handleSavePassword = async (e) => {
        e.preventDefault();
        setMsgPass({ type: '', text: '' });

        if (passData.nueva !== passData.confirmar) {
            return setMsgPass({ type: 'error', text: 'Las nuevas contraseñas no coinciden.' });
        }
        if (passData.nueva.length < 6) {
            return setMsgPass({ type: 'error', text: 'La nueva contraseña debe tener al menos 6 caracteres.' });
        }

        setGuardandoPass(true);
        try {
            await apiService.cambiarPassword(user.username, passData.actual, passData.nueva);
            setMsgPass({ type: 'success', text: 'Contraseña actualizada con éxito.' });
            setPassData({ actual: '', nueva: '', confirmar: '' }); // Limpiar formulario
        } catch (err) {
            setMsgPass({ type: 'error', text: err.message || 'La contraseña actual es incorrecta.' });
        } finally {
            setGuardandoPass(false);
        }
    };

    if (cargando) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
                <p className="text-gray-500 mt-4 font-medium">Cargando datos...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
            
            {/* SECCIÓN 1: DATOS DEL PERFIL */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-indigo-800 to-indigo-600 px-8 py-8 text-white flex justify-between items-center">
                    <div className="flex items-center gap-5">
                        <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                            <User className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-extrabold">Datos Personales</h2>
                            <p className="text-indigo-100 mt-1 flex items-center gap-2 text-sm">
                                <Mail className="w-4 h-4" /> {user?.username} ({user?.rol === 'ROLE_ADMIN' ? 'Administrador' : 'Cliente'})
                            </p>
                        </div>
                    </div>
                    {!editMode && (
                        <button onClick={() => setEditMode(true)} className="bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold cursor-pointer">
                            <Edit3 className="w-4 h-4" /> Editar Datos
                        </button>
                    )}
                </div>

                <div className="p-8">
                    {msgPerfil.text && (
                        <div className={`mb-6 p-4 rounded-xl flex items-start gap-2.5 border text-sm ${msgPerfil.type === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                            {msgPerfil.type === 'error' ? <AlertCircle className="w-5 h-5 flex-shrink-0" /> : <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
                            <span>{msgPerfil.text}</span>
                        </div>
                    )}

                    <form onSubmit={handleSavePerfil} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 flex items-center gap-2"><User className="w-4 h-4 text-indigo-500" /> Nombre Completo</label>
                                <input type="text" value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} disabled={!editMode} required className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all" />
                            </div>

                            {/* Solo mostramos Teléfono y Dirección a los Clientes */}
                            {user?.rol === 'ROLE_CLIENTE' && (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 flex items-center gap-2"><Phone className="w-4 h-4 text-indigo-500" /> Teléfono</label>
                                        <input type="tel" value={formData.telefono} onChange={(e) => setFormData({...formData, telefono: e.target.value})} disabled={!editMode} placeholder="Agrega un teléfono" className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all" />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-bold text-gray-700 flex items-center gap-2"><MapPin className="w-4 h-4 text-indigo-500" /> Dirección de Envío</label>
                                        <textarea value={formData.direccion} onChange={(e) => setFormData({...formData, direccion: e.target.value})} disabled={!editMode} rows="2" placeholder="Agrega tu dirección" className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all resize-none" />
                                    </div>
                                </>
                            )}
                        </div>

                        {editMode && (
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <button type="button" onClick={() => setEditMode(false)} className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 cursor-pointer">Cancelar</button>
                                <button type="submit" disabled={guardandoPerfil} className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2 cursor-pointer disabled:opacity-50">
                                    {guardandoPerfil ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Guardar
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>

            {/* SECCIÓN 2: CAMBIO DE CONTRASEÑA */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-gray-50 px-8 py-5 border-b border-gray-100 flex items-center gap-3">
                    <Key className="w-6 h-6 text-indigo-600" />
                    <h3 className="text-xl font-bold text-gray-800">Seguridad y Contraseña</h3>
                </div>
                
                <div className="p-8">
                    {msgPass.text && (
                        <div className={`mb-6 p-4 rounded-xl flex items-start gap-2.5 border text-sm ${msgPass.type === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                            {msgPass.type === 'error' ? <AlertCircle className="w-5 h-5 flex-shrink-0" /> : <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
                            <span>{msgPass.text}</span>
                        </div>
                    )}

                    <form onSubmit={handleSavePassword} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Contraseña Actual</label>
                            <input type="password" value={passData.actual} onChange={(e) => setPassData({...passData, actual: e.target.value})} required placeholder="••••••••" className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Nueva Contraseña</label>
                            <input type="password" value={passData.nueva} onChange={(e) => setPassData({...passData, nueva: e.target.value})} required placeholder="Mínimo 6 caracteres" className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Confirmar Nueva</label>
                            <input type="password" value={passData.confirmar} onChange={(e) => setPassData({...passData, confirmar: e.target.value})} required placeholder="Repite la contraseña" className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none" />
                        </div>
                        
                        <div className="md:col-span-3 flex justify-end pt-2">
                            <button type="submit" disabled={guardandoPass} className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gray-800 hover:bg-black transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50">
                                {guardandoPass ? <Loader2 className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />} Actualizar Contraseña
                            </button>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    );
};