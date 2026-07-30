import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { Truck, Trash2, RefreshCw, AlertCircle } from 'lucide-react';

export const AdminProveedores = () => {
    const [proveedores, setProveedores] = useState([]);
    const [cargando, setCargando] = useState(true);
    
    // Campos del formulario
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');
    const [direccion, setDiredireccion] = useState('');
    
    const [guardando, setGuardando] = useState(false);
    const [formError, setFormError] = useState(null);

    const cargarProveedores = async () => {
        setCargando(true);
        try {
            const datos = await apiService.getProveedores();
            setProveedores(datos || []);
        } catch (e) {
            console.error(e);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarProveedores();
    }, []);

    const handleCrear = async (e) => {
        e.preventDefault();
        setFormError(null);

        if (!nombre.trim()) return setFormError('El nombre de la empresa o proveedor es obligatorio.');
        
        setGuardando(true);
        try {
            await apiService.crearProveedor({
                nombre: nombre.trim(),
                email: email.trim(),
                telefono: telefono.trim(),
                direccion: direccion.trim()
            });

            setNombre('');
            setEmail('');
            setTelefono('');
            setDiredireccion('');
            cargarProveedores();
        } catch (e) {
            setFormError(e.message);
        } finally {
            setGuardando(false);
        }
    };

    const handleEliminar = async (id) => {
        if (!window.confirm("¿Estás seguro de eliminar este proveedor?")) return;
        try {
            await apiService.eliminarProveedor(id);
            cargarProveedores();
        } catch (e) {
            alert("No se puede eliminar el proveedor. Asegúrate de que no tenga productos asociados.");
        }
    };

    return (
        <div className="space-y-6">
            {/* Formulario de Alta */}
            <form onSubmit={handleCrear} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                <h3 className="font-bold text-gray-800 flex items-center gap-2 text-sm uppercase tracking-wider">
                    <Truck className="w-5 h-5 text-indigo-600" /> Registrar Nuevo Proveedor
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <input
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Nombre / Empresa *"
                        className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder="Correo electrónico"
                        className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        placeholder="Teléfono"
                        className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                        value={direccion}
                        onChange={(e) => setDiredireccion(e.target.value)}
                        placeholder="Dirección"
                        className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {formError && (
                    <div className="bg-red-50 text-red-700 p-3 rounded-xl flex items-center gap-2 text-sm border border-red-200">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{formError}</span>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={guardando}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors cursor-pointer disabled:opacity-50"
                >
                    {guardando ? 'Guardando...' : 'Añadir Proveedor'}
                </button>
            </form>

            {/* Tabla de Proveedores */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-gray-50">
                    <h3 className="font-bold text-gray-800">Proveedores Registrados</h3>
                    <button
                        onClick={cargarProveedores}
                        className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                    >
                        <RefreshCw className="w-4 h-4" /> Recargar
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white border-b border-gray-200 text-xs uppercase text-gray-500">
                            <tr>
                                <th className="p-4">ID</th>
                                <th className="p-4">Nombre / Empresa</th>
                                <th className="p-4">Correo</th>
                                <th className="p-4">Teléfono</th>
                                <th className="p-4">Dirección</th>
                                <th className="p-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {proveedores.map(p => (
                                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 text-gray-400">#{p.id}</td>
                                    <td className="p-4 font-bold text-gray-800">{p.nombre}</td>
                                    <td className="p-4 text-gray-600">{p.email || 'N/A'}</td>
                                    <td className="p-4 text-gray-600">{p.telefono || 'N/A'}</td>
                                    <td className="p-4 text-gray-600">{p.direccion || 'N/A'}</td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => handleEliminar(p.id)}
                                            className="text-red-500 hover:text-red-700 font-medium text-xs flex items-center gap-1 ml-auto cursor-pointer"
                                        >
                                            <Trash2 className="w-4 h-4" /> Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {proveedores.length === 0 && !cargando && (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-gray-500">
                                        No hay proveedores registrados.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};